// @ts-nocheck
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";
import {
  getLatestTxsUntilBlockTime,
  timer,
  uploadTxToDB,
  checkUpgradeAndHalt,
  base58
} from '../../tools/utils'

const SOLANART = new PublicKey('CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz')

class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    }
}

class tx_info extends Assignable {

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
        price: price,
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

async function processLatestTxs(latestTxs) {
  let payloads = []
  for (let i = 0; i < latestTxs.length; i++) {
    try {
      let tx = latestTxs[i]
      for (let index = 0; index < tx.transaction.message.instructions.length; index++) {
        try {
          let ix = tx.transaction.message.instructions[index]
          await checkUpgradeAndHalt(ix, SOLANART)
          if (ix.programId.toBase58() == SOLANART.toBase58()) {
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
        } catch {}
      }
    } catch {}
  }
  return payloads
}

async function magiceden(until) {
  const txs = await getLatestTxsUntilBlockTime(SOLANART, until)
  const payloads = await processLatestTxs(txs)
  for (let i = 0; i < payloads.length; i++) {
    await uploadTxToDB(payloads[i])
  }
  return txs.length > 0 ? txs[txs.length - 1].blockTime : until
}

async function main() {
  let until = 1645483959
  while (true) {
    let prev_until = until
    await timer(1000)
    try {
      until = await magiceden(until)
    } catch (e) {
      until = prev_until
    }
  }
}

console.log('Running client.');

main().then(() => console.log(''));
