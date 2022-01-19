from solana.rpc.api import Client
import pprint
import base58
import json
import requests
import os
from multiprocessing import Pool

pp = pprint.PrettyPrinter(indent=1)
http_client = Client("https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/")

TRANSACTION_URI = 'http://localhost:3000/transactions'
COLLECTION_URI = 'http://localhost:3000/collections/'

SMB = 'GvQVaDNLV7zAPNx35FqWmgwuxa4B2h5tuuL73heqSf1C'
LAMPORTS_PER_SOL = 1000000000

def tx_date(tx):
  return tx['result']['blockTime'] * 1000

def get_price(data):
  number = "".join(reversed([data[i:i+2] for i in range(0, len(data), 2)]))
  return int(number, 16) / LAMPORTS_PER_SOL

def get_account(tx, index):
  try:
    return tx['result']['transaction']['message']['accountKeys'][index]
  except:
    return None

def ix_info(tx):
  try:
    instructions = tx['result']['transaction']['message']['instructions']
    data = base58.b58decode(instructions[-1]['data']).hex()
    return data, instructions[-1]['accounts']
  except Exception:
    return None, None

def tx_type(tx):
  data, _ = ix_info(tx)
  if not data:
    return None
  elif data[:2] == '00':
    return 'list'
  elif data[:2] == '01':
    last_ix_accounts = tx['result']['transaction']['message']['instructions'][-1]['accounts']
    if last_ix_accounts[0] == last_ix_accounts[3]:
      return 'cancel'
    else:
      return 'buy'
  
def get_cancel_tx_info(tx):
  _, accounts = ix_info(tx)
  owner_index = accounts[0] 

  payload = {}
  payload['date'] = tx_date(tx)
  payload['type'] = 'cancel'
  payload['owner'] = get_account(tx, owner_index)
  payload['new_owner'] = payload['owner']
  payload['mint'] = tx['result']['meta']['postTokenBalances'][0]['mint']
  return payload

def get_list_tx_price(tx):
  data, _ = ix_info(tx)
  return get_price(data[2:18])

def get_list_tx_info(tx):
  _, accounts = ix_info(tx)
  owner_index = accounts[0]
  mint_index = accounts[2]

  payload = {}
  payload['date'] = tx_date(tx)
  payload['type'] = 'list'
  payload['price'] = get_list_tx_price(tx)
  payload['owner'] = get_account(tx, owner_index)
  payload['new_owner'] = payload['owner']
  payload['mint'] = get_account(tx, mint_index)
  return payload

def get_buy_tx_info(tx):
  _, accounts = ix_info(tx)
  owner_index = accounts[3]
  new_owner_index = accounts[0]

  payload = {}
  payload['date'] = tx_date(tx)
  payload['type'] = 'buy'
  payload['price'] = (tx['result']['meta']['preBalances'][new_owner_index] - tx['result']['meta']['postBalances'][new_owner_index]) / LAMPORTS_PER_SOL
  payload['owner'] = get_account(tx, owner_index)
  payload['new_owner'] = get_account(tx, new_owner_index)
  payload['mint'] = tx['result']['meta']['postTokenBalances'][0]['mint']
  return payload

def get_transaction_info(tx):
  payload = {}
  type = tx_type(tx)
  if type == 'list':
    payload = get_list_tx_info(tx)
  elif type == 'cancel':
    payload = get_cancel_tx_info(tx)
  elif type == 'buy':
    payload = get_buy_tx_info(tx)
  payload['type'] = type
  payload['tx'] = tx['result']['transaction']['signatures'][0]
  payload['marketplace'] = 'smb'
  return payload

def get_payload(sig):
  tx = http_client.get_transaction(sig)
  err = 1
  payload = {'tx': sig, 'marketplace': 'smb'}
  try:
    err = tx['result']['meta']['err']
  except:
    # tx has a problem
    return payload
  if err is not None:
    return payload
  payload = get_transaction_info(tx)
  return payload

def process_tx(sig):
  payload = get_payload(sig)

  if 'mint' in payload:
    symbol = requests.get(COLLECTION_URI + payload['mint']).json()
    if symbol:
      payload['symbol'] = symbol['symbol']

  requests.post(TRANSACTION_URI, json=payload)

def get_latest_transactions(until=None):
  before = None
  sigs = []
  while True:
    res = http_client.get_signatures_for_address(
      account = SMB,
      before = before,
      until = until,
      commitment = 'finalized'
    )
    if len(res['result']) == 0:
      return sigs
    for sig in res['result']:
      sigs.append(sig['signature'])
    before = res['result'][-1]['signature']
    if len(res['result']) < 1000:
      return sigs
    print(len(sigs))

def update_last_sig(tx_hash):
  with open('last_sig.json', 'r') as f:
    sigs = json.load(f)
  sigs.append(tx_hash)
  with open('last_sig.json', 'w') as f:
    json.dump(sigs, f)

if __name__ == '__main__':
  abspath = os.path.abspath(__file__)
  dname = os.path.dirname(abspath)
  os.chdir(dname)

  with open('last_sig.json', 'r') as f:
    sigs = json.load(f)
  until = sigs[-1]
  
  sigs = get_latest_transactions(until)
  pool = Pool(64)
  pool.map(process_tx, sigs)
  pool.close()
  pool.join()

  # only update last_sig once all data is uploaded
  update_last_sig(sigs[0])
