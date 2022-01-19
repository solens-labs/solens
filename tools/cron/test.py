from solana.rpc.api import Client
import pprint
import json
import base58
from multiprocessing import Pool
from datetime import datetime
import requests

pp = pprint.PrettyPrinter(indent=1)
http_client = Client("https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/")

x = http_client.get_transaction('66kG6p2FcrggSZxAUi1v36ZGGBPknFY1ptHKJbpCQqE6ME183NhUwjjmCRRXQuPEQMxqNLKgYhFiRG28Sf4XJZU1')
pp.pprint(x)
