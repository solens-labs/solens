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

SMB = 'J7RagMKwSD5zJSbRQZU56ypHUtux8LRDkUpAPSKH4WPp'
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
    for ix in instructions:
      data = base58.b58decode(ix['data']).hex()
      if data[:16] == '856e4aaf709ff59f' or data[:16] == '5f81edf00831df84' or data[:16] == '95e23468068ee627':
        return data, ix['accounts']
    return None, None
  except Exception:
    return None, None

def tx_type(tx):
  data, accounts = ix_info(tx)
  if not data:
    return
  elif data[:16] == '856e4aaf709ff59f' and data[-2:] == '01':
    return 'list'
  elif data[:16] == '856e4aaf709ff59f' and data[-2:] == '00':
    return 'offer'
  elif data[:16] == '5f81edf00831df84':
    if len(tx['result']['meta']['postTokenBalances']) == 0:
      return 'cancel_offer'
    else:
      return 'cancel'
  elif data[:16] == '95e23468068ee627':
    index = accounts[1]
    if get_account(tx, index) == 'So11111111111111111111111111111111111111112':
      return 'accept_offer'
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
  if data[:16] == '856e4aaf709ff59f' and data[-2:] == '01':
    return get_price(data[32:48])

def get_list_tx_info(tx):
  _, accounts = ix_info(tx)
  owner_index = accounts[0]
  mint_index = accounts[1]

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
  new_owner_index = accounts[0]
  owner_index = accounts[7]
  mint_index = accounts[1]

  payload = {}
  payload['date'] = tx_date(tx)
  payload['type'] = 'buy'
  payload['price'] = (tx['result']['meta']['preBalances'][new_owner_index] - tx['result']['meta']['postBalances'][new_owner_index]) / LAMPORTS_PER_SOL
  payload['owner'] = get_account(tx, owner_index)
  payload['new_owner'] = get_account(tx, new_owner_index)
  payload['mint'] = get_account(tx, mint_index)
  return payload

def get_accept_tx_info(tx):
  _, accounts = ix_info(tx)
  new_owner_index = accounts[7]
  owner_index = accounts[0]
  mint_index = accounts[2]
  escrow_index = accounts[5]

  payload = {}
  payload['date'] = tx_date(tx)
  payload['type'] = 'buy'
  payload['subtype'] = 'accept_offer'
  payload['price'] = (tx['result']['meta']['preBalances'][escrow_index] - tx['result']['meta']['postBalances'][escrow_index]) / LAMPORTS_PER_SOL
  payload['owner'] = get_account(tx, owner_index)
  payload['new_owner'] = get_account(tx, new_owner_index)
  payload['mint'] = get_account(tx, mint_index)
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
  elif type == 'accept_offer':
    payload = get_accept_tx_info(tx)
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
  pool = Pool(2)
  pool.map(process_tx, sigs)
  pool.close()
  pool.join()

  # only update last_sig once all data is uploaded
  update_last_sig(sigs[0])
