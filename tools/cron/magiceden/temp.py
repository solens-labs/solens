from solana.rpc.api import Client
import pprint
import json
import base58
from multiprocessing import Pool
import os
import requests

pp = pprint.PrettyPrinter(indent=1)
http_client = Client("https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/")

LIST_TX_1       = '96d480ba74018371'
LIST_TX_2       = '0000000000171600'
OFFER_TX        = 'ee4d945bc8975c92'
CANCEL_OFFER_TX = '28f3bed9d0fd56ce'
ACCEPT_OFFER_TX = 'c4bf01e590ac7ae3'
CANCLE_LIST     = '9ccb36b326482115'
BUY_TX_1        = '438e36d81f1d1b5c'
BUY_TX_2        = '2f031b61d7ecdb90'

LAMPORTS_PER_SOL = 1000000000

# TRANSACTION_URI = 'http://localhost:3000/transactions'
# COLLECTION_URI = 'http://localhost:3000/collections/'

ME = 'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8'

def retry(sig, times):
  for i in range(times):
    res = get_payload(sig)
    if res is None or 'mint' in res.keys():
      return res
  return res

def tx_data(tx, instruction=0):
  try:
    for ix in
    data = tx['result']['transaction']['message']['instructions'][instruction]['data']
    return base58.b58decode(data).hex()
  except Exception:
    return None

def tx_date(tx):
  return tx['result']['blockTime'] * 1000

def ix_accounts(tx):
  return tx['result']['blockTime'] * 1000

def ix_accounts(tx, instruction=0):
  return tx['result']['transaction']['message']['instructions'][instruction]['accounts']
  
def get_account(tx, index):
  return tx['result']['transaction']['message']['accountKeys'][index]

def get_mint_from_tx(tx):
  try:
    return tx['result']['meta']['postTokenBalances'][0]['mint']
  except Exception:
    return None

def get_seller_from_list_tx(tx):
  try:
    return tx['result']['transaction']['message']['accountKeys'][0]
  except:
    return None

def get_price(data):
  data = data[16:32]
  number = "".join(reversed([data[i:i+2] for i in range(0, len(data), 2)]))
  return int(number, 16) / LAMPORTS_PER_SOL

def get_offer_bidder(tx):
  try:
    return tx['result']['transaction']['message']['accountKeys'][0]
  except:
    return None
def get_payload(sig):
  tx = http_client.get_transaction(sig)

  try:
    if tx['result']['meta']['err'] is not None:
      return
  except:
    pass

  payload = {}
  payload['marketplace'] = 'magiceden'
  payload['tx'] = sig
  try:
    data = tx_data(tx)
  except KeyError:
    return payload

  if not data:
    return payload

  if len(data) < 16:
    return payload
  
  if data[:16] == OFFER_TX:
    payload['bidder'] = get_offer_bidder(tx)
    payload['price'] = get_price(data)
    payload['date'] = tx_date(tx)
    payload['type'] = 'offer'
  
  elif data[:16] == LIST_TX_1:
    payload['owner'] = get_seller_from_list_tx(tx)
    payload['new_owner'] = payload['owner']
    payload['mint'] = get_mint_from_tx(tx)
    payload['price'] = get_price(data)
    payload['date'] = tx_date(tx)
    payload['type'] = 'list'

  elif data[:16] == LIST_TX_2:
    payload['owner'] = get_seller_from_list_tx(tx)
    payload['new_owner'] = payload['owner']
    payload['mint'] = get_mint_from_tx(tx)
    payload['price'] = get_price(tx_data(tx, 1))
    payload['date'] = tx_date(tx)
    payload['type'] = 'list'

  elif data[:16] == CANCEL_OFFER_TX:
    payload['date'] = tx_date(tx)
    payload['type'] = 'cancel_offer'  

  elif data[:16] == ACCEPT_OFFER_TX:
    payload['owner'] = tx['result']['transaction']['message']['accountKeys'][0]
    payload['new_owner'] = tx['result']['transaction']['message']['accountKeys'][1]
    payload['bidder'] = tx['result']['transaction']['message']['accountKeys'][1]
    payload['mint'] = get_mint_from_tx(tx)
    payload['price'] = (tx['result']['meta']['preBalances'][4] - tx['result']['meta']['postBalances'][4]) / LAMPORTS_PER_SOL
    payload['date'] = tx_date(tx)
    payload['type'] = 'accept_offer'

  elif data[:16] == CANCLE_LIST:
    payload['type'] = 'cancel'
    payload['price'] = 0
    payload['owner'] = tx['result']['transaction']['message']['accountKeys'][0]
    payload['new_owner'] = tx['result']['transaction']['message']['accountKeys'][0]
    payload['mint'] = get_mint_from_tx(tx)
    payload['date'] = tx_date(tx)

  elif data[:16] == BUY_TX_1:
    payload['owner'] = tx['result']['transaction']['message']['accountKeys'][2]
    payload['new_owner'] = tx['result']['transaction']['message']['accountKeys'][0]
    payload['mint'] = get_mint_from_tx(tx)
    payload['price'] = (tx['result']['meta']['preBalances'][0] - tx['result']['meta']['postBalances'][0]) / LAMPORTS_PER_SOL
    payload['date'] = tx_date(tx)
    payload['type'] = 'buy'

  elif data[:16] == BUY_TX_2:
    payload['owner'] = tx['result']['transaction']['message']['accountKeys'][2]
    payload['new_owner'] = tx['result']['transaction']['message']['accountKeys'][0]
    payload['mint'] = get_mint_from_tx(tx)
    payload['price'] = (tx['result']['meta']['preBalances'][0] - tx['result']['meta']['postBalances'][0]) / LAMPORTS_PER_SOL
    payload['date'] = tx_date(tx)
    payload['type'] = 'buy'

  if 'mint' in payload:
    symbol = requests.get(COLLECTION_URI + payload['mint']).json()
    if symbol:
      payload['symbol'] = symbol['symbol']

  return payload

def process_tx(sig):
  payload = retry(sig, 5)
  if payload:
    requests.post(TRANSACTION_URI, json=payload)

def get_latest_transactions(until=None):
  before = None
  sigs = []
  while True:
    res = http_client.get_signatures_for_address(
      account = ME,
      before = before,
      until = until,
      commitment = 'finalized'
    )
    if len(res['result']) == 0:
      return sigs
    for sig in res['result']:
      sigs.append(sig['signature'])
    before = res['result'][-1]['signature']
    print(len(sigs))
    if len(res['result']) < 1000:
      return sigs

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
  with open('sigs.json', 'w+') as f:
    json.dump(sigs, f)
  pool = Pool(32)
  from tqdm import tqdm
  out = list(tqdm(pool.imap(process_tx, sigs), total = len(sigs)))
  # pool.map(process_tx, sigs)
  pool.close()
  pool.join()

  # only update last_sig once all data is uploaded
  update_last_sig(sigs[0])
