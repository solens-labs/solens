from solana.rpc.api import Client
from datetime import datetime
import pprint
import json
import requests
import os
from multiprocessing import Pool

pp = pprint.PrettyPrinter(indent=1)
http_client = Client("https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/")

TRANSACTION_URI = 'http://localhost:3000/transactions'
COLLECTION_URI = 'http://localhost:3000/collections/'

SOLANART = 'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz'

def retry(sig, times):
  for i in range(times):
    res = get_payload(sig)
    if res is None or 'mint' in res.keys():
      return res
  return res

def get_initial_listing_tx(mint):
  res = http_client.get_signatures_for_address(mint, before=None, limit=1000)
  for sig in reversed(res['result']):
    tx = http_client.get_transaction(sig['signature'])
    for log in tx['result']['meta']['logMessages']:
      if SOLANART in log:
        return tx

def get_transaction_info(tx, sig):
  if is_listing_tx(tx):
    return get_listing_tx_info(tx, sig)
  elif is_update_tx(tx):
    return get_update_tx_info(tx, sig)
  elif is_cancel_tx(tx):
    return get_cancel_tx_info(tx, sig)
  elif is_buy_tx(tx): # IMPORTANT should be the last condition
    return get_buy_tx_info(tx, sig)
  else:
    return {'tx': sig}

def is_listing_tx(tx):
  logs = tx['result']['meta']['logMessages']
  if len(logs) >= 3 and 'price_sol' in logs[-3]:
      return True
  return False

def is_cancel_tx(tx):
  logs = tx['result']['meta']['logMessages']
  for log in logs:
    if 'Sale cancelled by seller' in log:
      return True
  return False

def is_update_tx(tx):
  logs = tx['result']['meta']['logMessages']
  if len(logs) > 2 and 'Program log: Old / New price:' in logs[2]:
      return True
  return False

def is_buy_tx(tx):
  logs = tx['result']['meta']['logMessages']
  for log in logs:
    if 'Instruction: Buy' in log:
      return True
  return False

def get_listing_tx_info(tx, sig):
  try:
    raw_string = tx['result']['meta']['logMessages'][-3].replace('\\', '')
    start = raw_string.index('"')
    memo = json.loads(raw_string[start + 1: -1])
    res = {}
    res['mint'] = memo['token_add']
    res['owner'] = tx['result']['meta']['logMessages'][-4].split()[-1]
    res['price'] = memo['price_sol']
    res['date'] = tx['result']['blockTime'] * 1000
    res['marketplace'] = 'solanart'
    res['type'] = 'list'
    res['tx'] = sig
    return res
  except:
    return {'tx': sig}

def get_update_tx_info(tx, sig):
  try:
    raw_string = tx['result']['meta']['logMessages'][2]
    res = {}
    res['mint'] = tx['result']['transaction']['message']['accountKeys'][2]
    res['owner'] = tx['result']['transaction']['message']['accountKeys'][0]
    res['price'] = int(raw_string.split()[-1]) / 1000000000
    res['date'] = tx['result']['blockTime'] * 1000
    res['marketplace'] = 'solanart'
    res['type'] = 'update'
    res['tx'] = sig
    return res 
  except:
    return {'tx': sig}

def get_buy_tx_info(tx, sig):
  try:
    accounts = tx['result']['transaction']['message']['accountKeys']
    post_balances = tx['result']['meta']['postBalances']
    pre_balances = tx['result']['meta']['preBalances']
    seller_index = 3
    buyer_index = 0
    price = (pre_balances[buyer_index] - post_balances[buyer_index]) / 1000000000
    res = {}
    res['mint'] = tx['result']['meta']['preTokenBalances'][0]['mint']
    res['owner'] = accounts[seller_index]
    res['new_owner'] = accounts[buyer_index]
    res['price'] = price
    res['date'] = tx['result']['blockTime'] * 1000
    res['marketplace'] = 'solanart'
    res['type'] = 'buy'
    res['tx'] = sig
    return res
  except:
    return {'tx': sig}

def get_cancel_tx_info(tx, sig):
  try:
    accounts = tx['result']['transaction']['message']['accountKeys']
    owner_index = tx['result']['meta']['postTokenBalances'][0]['accountIndex']
    res = {}
    res['mint'] = tx['result']['meta']['preTokenBalances'][0]['mint']
    res['owner'] = accounts[owner_index]
    res['new_owner'] = accounts[owner_index]
    res['price'] = 0
    res['date'] = tx['result']['blockTime'] * 1000
    res['marketplace'] = 'solanart'
    res['type'] = 'cancel'
    res['tx'] = sig
    return res
  except:
    return {'tx': sig}

def get_payload(sig):
  tx = http_client.get_transaction(sig)
  err = 1
  try:
    err = tx['result']['meta']['err']
  except:
    # tx has a problem
    payload = {'tx': sig, 'marketplace': 'solanart'}
    return payload
  if err is not None:
    payload = {'tx': sig, 'marketplace': 'solanart'}
    return None
  payload = get_transaction_info(tx, sig)
  payload['tx'] = sig
  payload['marketplace'] = 'solanart'

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
      account = SOLANART,
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
  
  pool = Pool(16)
  from tqdm import tqdm
  out = list(tqdm(pool.imap(process_tx, sigs), total = len(sigs)))
  # pool.map(process_tx, sigs)
  pool.close()
  pool.join()

  # only update last_sig once all data is uploaded
  update_last_sig(sigs[0])
