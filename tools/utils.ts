import {
  Connection,
  PublicKey,
  ConfirmedSignatureInfo,
  ParsedInstruction,
  PartiallyDecodedInstruction
} from "@solana/web3.js";
import * as _ from "lodash"
import * as mongoDB from "mongodb";
import axios from "axios";
import { exit } from 'process';

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const base58 = require("base-x")(BASE58);

export const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/')

export async function timer(ms: number) {
  return new Promise( res => setTimeout(res, ms) )
};

export async function getDatabaseClient() {
  const dbUser = process.env.MONGO_USER
  const dbPassword = process.env.MONGO_PASSWORD
  const uri = `mongodb+srv://${dbUser}:${dbPassword}@arnori-us-west.ohyuk.mongodb.net/arnoriDB?retryWrites=true&w=majority`
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(uri);
  await client.connect();
  return client
}

export async function getFailedSigs(sigs: string[]) {
  const txs = await connection.getParsedConfirmedTransactions(sigs)
  const failedTxs = _.filter(txs, (tx => tx && tx.meta && tx.meta.err))
  // @ts-ignore
  return failedTxs.map(tx => tx.transaction.signatures[0])
}

export async function deleteTxFromDB(sigs: string[], client: mongoDB.MongoClient) {
  const transactions = client.db("arnoriDB").collection("transactions");
  for (let i = 0; i < sigs.length; i++) {
    const txs = await transactions.deleteOne({tx: sigs[i]})
    console.log(txs, i)
  }
}

function reachedToBlock(confirmedSigs: ConfirmedSignatureInfo[], earliestBlockTime: number) {
  for (let i = 0; i < confirmedSigs.length; i++) {
    if (confirmedSigs[i].blockTime! < earliestBlockTime) {
      return true
    }
  }
  return false
}

/*
* This function doesn't work if there are more than 1000 transactions
* in the same block for an account.
* This is due to an issue in the RPC implementation.
* Read more at https://github.com/solana-labs/solana/issues/22456
*/
function getSigWithSecondSmallestBlockTime(confirmedSigs: ConfirmedSignatureInfo[]) {
  const sortedTxs = _.sortBy(confirmedSigs, confirmedSig => confirmedSig.blockTime)
  for (let i = 0; i < sortedTxs.length; i++) {
    if (sortedTxs[i].blockTime! > sortedTxs[0].blockTime!) {
      return sortedTxs[i].signature
    }
  }
  return sortedTxs[0].signature
}

export async function getLatestTxsUntilBlockTime(account: PublicKey, blockTime: number, excludeFailedSigs : boolean = true) {
  let before = undefined;
  let done = false;
  let latestTxs = []
  while (!done) {
    let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(account, {before: before}, 'confirmed')
    done = reachedToBlock(confirmedSigs, blockTime) || confirmedSigs.length < 1000
    if (done) {
      confirmedSigs = _.filter(confirmedSigs, (confirmedSig) => confirmedSig.blockTime! >= blockTime)
    } else {
      before = getSigWithSecondSmallestBlockTime(confirmedSigs)
    }

    if (excludeFailedSigs) {
      confirmedSigs = _.filter(confirmedSigs, x => x && !x.err)
    }

    const sigs = confirmedSigs.map(confirmedSig => confirmedSig.signature)
    const confirmedTxs = await connection.getParsedConfirmedTransactions(sigs, 'confirmed')
    latestTxs.push(...confirmedTxs)
    console.log(latestTxs.length)
  }
  latestTxs = _.sortBy(latestTxs, x => x!.blockTime)
  return _.uniqWith(latestTxs, _.isEqual)
}

export async function getLatestSigsUntilBlockTime(account: PublicKey, blockTime: number, excludeFailedSigs : boolean = true) {
  let before = undefined;
  let done = false;
  let latestSigs = []
  while (!done) {
    let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(account, {before: before}, 'confirmed')

    done = reachedToBlock(confirmedSigs, blockTime) || confirmedSigs.length < 1000
    if (done) {
      confirmedSigs = _.filter(confirmedSigs, (confirmedSig) => confirmedSig.blockTime! >= blockTime)
    } else {
      before = getSigWithSecondSmallestBlockTime(confirmedSigs)
    }

    if (excludeFailedSigs) {
      confirmedSigs = _.filter(confirmedSigs, x => x && !x.err)
    }

    latestSigs.push(...confirmedSigs)
    console.log(latestSigs.length, confirmedSigs.length, before)
  }
  
  return _.sortBy(latestSigs, x => x!.blockTime)
}

export async function uploadTxToDB(payload: any) {
  if (payload == null) {
    return
  }
  const TRANSACTION_URI = 'http://localhost:3000/transactions'
  const COLLECTION_URI = 'http://localhost:3000/collections/'
  if (payload.mint) {
    try {
      try {
        const symbol = (await axios.get(`${COLLECTION_URI}${payload.mint}`)).data
        if (symbol) {
          payload.symbol = symbol.symbol
        }
      } catch {}
      await axios.post(
        TRANSACTION_URI,
        payload,
        {
          headers: {
            "content-type": "application/json",
            "Accept": "application/json"
          }
        }
      )
      console.log(payload)
    } catch {}
  }
}

export async function checkUpgradeAndHalt(ix: ParsedInstruction, account: PublicKey) {
  const STATUS_URI = 'http://localhost:3000/status'
  const BPF_UPGRADABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')
  if (ix.programId.toBase58() == BPF_UPGRADABLE.toBase58() && ix.parsed.info.programAccount == account.toBase58()) {
    await axios.post(
      STATUS_URI,
      {"live": false},
      { headers: { "content-type": "application/json", "Accept": "application/json" }}
    )
    console.log(`Program ${account.toBase58()} updated.`)
    return exit(1)
  }
}