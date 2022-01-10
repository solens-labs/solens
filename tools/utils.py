import requests
import json
import tqdm
from os.path import exists

ME_URI = "https://api-mainnet.magiceden.io"
headers = {"Content-Type": "application/json"}

def get_me_collections():
  uri = ME_URI + "/all_collections"
  all_collections = requests.get(uri)
  return all_collections.json()

def get_me_symbols():
  data = get_me_collections()
  symbols = []
  for collection in data['collections']:
    symbols.append(collection['symbol'])
  return symbols

def get_non_existent_symbols(symbols):
  collections = requests.get('http://localhost:3000/stats/allCollections').json()

  existing_symbols = []
  for collection in collections:
    existing_symbols.append(collection['symbol'])

  new_symbols = []
  for symbol in symbols:
    if symbol not in existing_symbols:
      new_symbols.append(symbol)

  return new_symbols

def get_me_collection_details(symbols):
  uri = ME_URI + "/rpc/getCollectionsWithSymbols?symbols=" + json.dumps(symbols)
  return requests.get(uri).json()

def dump_me_collections(outfile, symbols):
  dump = []
  batch_size = 20
  print("Dumping", len(symbols), "new collections.")
  for i in tqdm.tqdm(range(0, len(symbols), batch_size)):
    try:
      batch = symbols[i: i + batch_size]
      dump.extend(get_me_collection_details(batch))
    except:
      print("ERROR while processing batch: " + batch)
  print(len(dump))

  with open(outfile, 'w+') as f:
    json.dump(dump, f)
  return dump

def filter_me_collections(infile):
  with open(infile, 'r') as f:
    all_collections = json.load(f)
  
  valid_collections = []
  for collection in all_collections:
    if "symbol" not in collection.keys():
      continue
    if "mint" not in collection.keys() or len(collection["mint"]) == 0:
      continue
    valid_collections.append(collection)
  return valid_collections
  
def sanitized_me_collections(collections):
  sanitized_collections = []
  for collection in collections:
    data = {
      "symbol": collection.get("symbol"),
      "name": collection.get("name") or "",
      "image": collection.get("image") or "",
      "description": collection.get("description") or "",
      "createdAt": collection.get("createdAt") or "",
      "candyMachineIds": collection.get("candyMachineIds") or [],
      "updateAuthorities": collection.get("updateAuthorities") or [],
      "mint": collection.get("mint"),
      "supply": collection.get("totalItems") or len(collection.get("mint")),
      "website": collection.get("website") or "",
      "twitter": collection.get("twitter") or "",
      "discord": collection.get("discord") or "",
    }
    sanitized_collections.append(data)
  return sanitized_collections

def update_me_collections(collections):

  uri = "http://localhost:3000/collections"
  for collection in tqdm.tqdm(collections):
    print(collection.get("symbol"))
    res = requests.post(uri, data=json.dumps(collection), headers=headers)
    if res.status_code != 200:
      print('Error while updating collection: ' + collection.get("symbol"))

def update_existing_me_collections_to_database(me_collections):
  def get_db_collection(symbol):
    uri = "http://localhost:3000/admin/getCollection" + "?symbol=" + symbol
    return requests.get(uri).json()

  for collection in me_collections:
    db_collection = get_db_collection(collection["symbol"])
    if db_collection:
      db_collection = db_collection[0]
      if len(db_collection["mint"]) < len(collection["mint"]):
        if collection["supply"] != len(collection["mint"]):
          print(collection["symbol"], "sould be investigated manually since supply doesn't match the number of mints")
          print("supply", collection["supply"], "mints", len(collection["mint"]))
          continue
        
        
        # NEVER MAKE THIS AUTOMATIC!
        # Sometimes ME has more mints thant the official supply!
        # First only print the sybmols. then manually check the description, or their website then add them to the deny_list if needed.
        deny_list = ["solana_bros", "baebots", "solluminati", "the_salty_butlers", "adorable_dinos"]
        if collection["symbol"] in deny_list:
          continue

        print("Updaging the database", collection["symbol"], "from", len(db_collection.get('mint')), "to", len(collection["mint"]), "mints.")
        res = requests.put("http://localhost:3000/collections", data=json.dumps(collection), headers=headers)
        print(res.status_code, collection["symbol"])
  

def add_new_me_collections_to_database(dump_file, symbols = None):
  
  if not symbols:
    symbols = get_me_symbols()

  # symbols = get_non_existent_symbols(symbols)
  print('Found', len(symbols), 'new collections.')
  
  # dump_me_collections(dump_file, symbols)

  collections = filter_me_collections(dump_file)
  collections = sanitized_me_collections(collections)
  print("Uploading", len(collections), "new collections.")
  # update_existing_me_collections_to_database(collections)
  update_me_collections(collections)



add_new_me_collections_to_database("solgods.json", ["solgods"])