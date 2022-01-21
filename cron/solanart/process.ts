// @ts-nocheck
import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";
import axios from "axios";
import { exit } from 'process';

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58 = require("base-x")(BASE58);

const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/')
const SOLANART = new PublicKey('CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz')
const BPF_UPGRADABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')
const TRANSACTION_URI = 'http://localhost:3000/transactions'
const COLLECTION_URI = 'http://localhost:3000/collections/'
const STATUS_URI = 'http://localhost:3000/status'


class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    }
}

class tx_info extends Assignable {

}

async function getLatestTxs(blockTime) {
  let before = null;
  let latestTxs = []
  while (true) {
    let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(SOLANART, {before: before}, 'confirmed')
    let sigs = []
    confirmedSigs.forEach((r) => {
      if (!r.err) {
        r.blockTime >= blockTime ? sigs.push(r.signature) : null;
      }
    })
    let confirmedTxs = await connection.getParsedConfirmedTransactions(sigs, 'confirmed')
    confirmedTxs.sort((a,b)=>a.blockTime - b.blockTime)
    confirmedTxs.forEach((tx) => {
      latestTxs.push(tx)
    })
    if (confirmedSigs[confirmedSigs.length - 1].blockTime < blockTime) {
      return latestTxs;
    } else {
      before = confirmedSigs[confirmedSigs.length - 1].signature
    }
  }
}


function getMintFromTx(tokenBalances, index) {
  let mint;
  tokenBalances.forEach((t) => {
    if (t.accountIndex == index) {
      mint = t.mint
    }
  })
  return mint
}

function getAcceptOfferTxInfo(tx, ix, index) {
  let accounts = ix.accounts;
  let res = new tx_info({
      mint: accounts[3].toBase58(),
      owner: accounts[0].toBase58(),
      price: new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL,
      date: tx.blockTime * 1000 + index,
      marketplace: 'solanart',
      escrow: accounts[1].toBase58(),
      type: 'buy',
      subtype: 'accept_offer',
      ix: index,
      tx: tx.transaction.signatures[0],
  })
  return res
}

function getListTxInfo(tx, ix, index) {
  let accounts = ix.accounts;
  let res = new tx_info({
    mint: accounts[4].toBase58(),
    owner: accounts[0].toBase58(),
    price: new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL,
    date: tx.blockTime * 1000,
    marketplace: 'solanart',
    escrow: accounts[3].toBase58(),
    type: 'list',
    tx: tx.transaction.signatures[0],
    ix: index
  })
  return res
}

function getBuyTxInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let mintIdx;
    accountKeys.forEach((k,index)=>{
        k.pubkey.toBase58() == accounts[1].toBase58() ? mintIdx = index : null;
    })

    let type;
    accounts[3].toBase58() == accounts[0].toBase58() ? type = 'cancel' : type = 'buy';
    // let price = new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL;
    let taIndex;
    accountKeys.forEach((k, index) => {
      k.pubkey.toBase58() == accounts[1].toBase58() ? taIndex = index : null;
    })
    let price = (tx.meta.preBalances[0] - tx.meta.postBalances[0] - tx.meta.postBalances[taIndex] - tx.meta.fee) / LAMPORTS_PER_SOL;
    if (type == 'cancel') {
      price = 0
    }

    let res = new tx_info({
        mint: getMintFromTx(tx.meta.postTokenBalances, mintIdx),
        owner: accounts[3].toBase58(),
        new_owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000,
        marketplace: 'solanart',
        escrow: accounts[4].toBase58(),
        type: type,
        tx: tx.transaction.signatures[0],
        ix: index
    })
    return res
}

function getUpdateTxInfo(tx, ix, index) {

    let accounts = ix.accounts;

    let res = new tx_info({
        mint: accounts[2].toBase58(),
        owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000,
        marketplace: 'solanart',
        escrow: accounts[1].toBase58(),
        type: 'list',
        subtype: 'update',
        tx: tx.transaction.signatures[0],
        ix: index
    })
    return res
}

async function halt() {
  await axios.post(STATUS_URI,
    {"live": false},
    { headers: { "content-type": "application/json", "Accept": "applicatin/json" }})
}

function checkUpgrade(ix) {
    return ix.programId.toBase58() == BPF_UPGRADABLE.toBase58() && ix.parsed.info.programAccount == SOLANART.toBase58()
}

async function processLatestTxs(latestTxs) {
  let payloads = []
  for (let i = 0; i < latestTxs.length; i++) {
    let tx = latestTxs[i]

    for (let index = 0; index < tx.transaction.message.instructions.length; index++) {
        let ix = tx.transaction.message.instructions[index]

        if (checkUpgrade(ix)) {
          await halt()
          return exit(1)
        } else if (ix.programId.toBase58() == SOLANART.toBase58()) {
              let ixData = base58.decode(ix.data)
              let type = new BN(ixData[0]).toNumber()
              switch (type) {
                  case 2:
                      payloads.push(getAcceptOfferTxInfo(tx, ix, index))
                      break;
                  case 4:
                      payloads.push(getListTxInfo(tx, ix, index))
                      break;
                  case 5:
                      payloads.push(getBuyTxInfo(tx, ix, index))
                      break;
                  case 6:
                      payloads.push(getUpdateTxInfo(tx, ix, index))
                      break;
                  default:
                      break;
              }

          }
      }
  }
  return payloads
}


async function process(until) {
  const txs = await getLatestTxs(until)

  const payload = await processLatestTxs(txs)
  let failed = 0
  let succeeded = 0
  for (let i = 0; i < payload.length; i++) {
    try {
      let p = payload[i]
      if (p.mint) {
        const symbol = (await axios.get(`${COLLECTION_URI}${p.mint}`)).data
        if (symbol) {
          p.symbol = symbol.symbol
        }
        await axios.post(
          TRANSACTION_URI,
          p,
          {
            headers: {
              "content-type": "application/json",
              "Accept": "application/json"
            }
          }
        )
        console.log(p.tx, p.date);
        console.log(p)
        succeeded += 1
      }
    }
    catch (error) {
      // pass - probably tx already exists in db
      failed += 1
    }
  }
  // console.log(`${payload.length} transacions processed, ${failed} failed, ${succeeded} succeeded.`)
  return txs[txs.length - 1].blockTime - 0
}

async function main() {
  let until = '1642631162'
  while (true) {
    let prev_until = until
    try {
      until = await process(until)
    } catch (e) {
      until = prev_until
    }
  }
}

console.log('Running client.');


main().then(() => console.log(''));