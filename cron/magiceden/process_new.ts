// @ts-nocheck
import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";
import axios from "axios";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58 = require("base-x")(BASE58);

const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/', {
    wsEndpoint: 'wss://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/'
})
let notified = false
const MAGICEDEN = new PublicKey('MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8')
const BPF_UPGRADABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')
const TRANSACTION_URI = 'http://localhost:3000/transactions'
const COLLECTION_URI = 'http://localhost:3000/collections/'


enum IxType {
    List = '96d480ba74018371',
    OldList = '96d480ba74018371',
    Cancel = '9ccb36b326482115',
    Buy = '438e36d81f1d1b5c',
    OldBuy = '2f031b61d7ecdb90',
    AcceptOffer = 'c4bf01e590ac7ae3',
}


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
    let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(MAGICEDEN, {before: before}, 'confirmed')
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

function getListTxInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let mintIdx;
    accountKeys.forEach((k, idx) => {
        k.pubkey.toBase58() == accounts[1].toBase58() ? mintIdx = idx : null;
    })
    let res = new tx_info({
        mint: getMintFromTx(tx.meta.postTokenBalances, mintIdx),
        owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(8, 16), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        escrow: accounts[2].toBase58(),
        type: 'list',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function getCancelTxInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let mintIdx;
    accountKeys.forEach((k, idx) => {
        k.pubkey.toBase58() == accounts[1].toBase58() ? mintIdx = idx : null;
    })

    let res = new tx_info({
        mint: getMintFromTx(tx.meta.postTokenBalances, mintIdx),
        owner: accounts[0].toBase58(),
        price: 0,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        escrow: accounts[3].toBase58(),
        type: 'cancel',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function getBuyTxInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let mintIdx;
    accountKeys.forEach((k, index) => {
        k.pubkey.toBase58() == accounts[1].toBase58() ? mintIdx = index : null;
    })
    let res = new tx_info({
        mint: getMintFromTx(tx.meta.postTokenBalances, mintIdx),
        owner: accounts[2].toBase58(),
        new_owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(8, 16), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        escrow: accounts[3].toBase58(),
        type: 'buy',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function getOldBuyTxInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let transferIxs = tx.meta.innerInstructions.find(inix => inix.index == index).instructions
    transferIxs = transferIxs.slice(0,transferIxs.length-1)
    let price = new BN(0);
    transferIxs.forEach((tix) => {
        price = price.add(new BN(tix.parsed.info.lamports))
    })
    let mintIdx;
    accountKeys.forEach((k, index) => {
        k.pubkey.toBase58() == accounts[1].toBase58() ? mintIdx = index : null;
    })
    let res = new tx_info({
        mint: getMintFromTx(tx.meta.postTokenBalances, mintIdx),
        owner: accounts[2].toBase58(),
        new_owner: accounts[0].toBase58(),
        price: price.toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        escrow: accounts[3].toBase58(),
        type: 'buy',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function getAcceptOfferTxInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let mintIdx;
    accountKeys.forEach((k, index) => {
        k.pubkey.toBase58() == accounts[2].toBase58() ? mintIdx = index : null;
    })
    let res = new tx_info({
        mint: getMintFromTx(tx.meta.postTokenBalances, mintIdx),
        owner: accounts[0].toBase58(),
        new_owner: accounts[1].toBase58(),
        price: new BN(base58.decode(ix.data).slice(8, 16), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        type: 'accept_offer',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function checkUpgrade(ix) {
    return ix.programId.toBase58() == BPF_UPGRADABLE.toBase58() && ix.parsed.info.programAccount == MAGICEDEN.toBase58()
}

async function processLatestTxs(latestTxs) {
    let payloads = []
    latestTxs.forEach((tx) => {
        tx.transaction.message.instructions.forEach((ix, index) => {
            if (checkUpgrade(ix)) {
                // error
                process.exit(-1)
            }
            if (ix.programId.toBase58() == MAGICEDEN.toBase58()) {
                let ixData = base58.decode(ix.data)
                let type = ixData.slice(0, 8).toString('hex')
                switch (type) {
                    case IxType.List || IxType.OldList:
                        payloads.push(getListTxInfo(tx, ix, index))
                        break;
                    case IxType.Cancel:
                        payloads.push(getCancelTxInfo(tx, ix, index))
                        break;
                    case IxType.OldBuy:
                        payloads.push(getOldBuyTxInfo(tx, ix, index))
                        break;
                    case IxType.Buy:
                        payloads.push(getBuyTxInfo(tx, ix, index))
                        break;
                    case IxType.AcceptOffer:
                        payloads.push(getAcceptOfferTxInfo(tx, ix, index))
                        break;
                    default:
                        break;
                }
            }
        })
    })
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
  let until = '1642407740'
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
