// @ts-nocheck
import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";
import {
  getLatestTxsUntilBlockTime,
  timer,
  uploadTxToDB,
  checkUpgradeAndHalt,
  base58
} from '../../tools/utils'

const MAGICEDEN = new PublicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K')

enum IxType {
    Sell = '33e685a4017f83ad',
    Buy = '66063d1201daebea',
    Deposit = 'f223c68952e1f2b6',
    Withdraw = 'b712469c946da122',
    CancelSell = 'c6c682cba35faf4b',
    CancelBuy = 'ee4c24da84b1e0e9',
    ExecuteSale = '254ad99d4f312306',
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

function getExecuteSaleInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let subtype = 'unknown';
    let buyer = accounts[0]
    let seller = accounts[1]
    accountKeys.forEach((a) => {
        // if (a.pubkey.toBase58() == buyer.toBase58()) {
        //     a.signer ? subtype = 'buy' : null
        // } else if (a.pubkey.toBase58() == seller.toBase58()) {
        //     a.signer ? subtype = 'accept_offer' : null
        // }
        if (a.pubkey.toBase58() == seller.toBase58()) {
          a.signer ? subtype = 'accept_offer' : null
        }
    })
    let res = new tx_info({
        mint: accounts[4].toBase58(),
        owner: accounts[1].toBase58(),
        new_owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(10, 18), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        version: '2',
        type: 'buy',
        subtype: subtype,
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function getSellInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let mintIdx;
    accountKeys.forEach((k, idx) => {
        k.pubkey.toBase58() == accounts[1].toBase58() ? mintIdx = idx : null;
    })

    let res = new tx_info({
        mint: accounts[4].toBase58(),
        owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(10, 18), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        version: '2',
        escrow: accounts[8].toBase58(),
        type: 'list',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function getCancelSellInfo(tx, ix, index) {
    let accounts = ix.accounts;
    let res = new tx_info({
        mint: accounts[3].toBase58(),
        owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(8, 16), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magiceden',
        version: '2',
        escrow: accounts[6].toBase58(),
        type: 'cancel',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

export async function processLatestTxs(latestTxs) {
  let payloads = []
  for (let i = 0; i < latestTxs.length; i++) {
    try {
      let tx = latestTxs[i]
      for (let index = 0; index < tx.transaction.message.instructions.length; index++) {
        try {
          let ix = tx.transaction.message.instructions[index]
          await checkUpgradeAndHalt(ix, MAGICEDEN)
          if (ix.programId.toBase58() == MAGICEDEN.toBase58()) {
            let ixData = base58.decode(ix.data)
            let type = ixData.slice(0, 8).toString('hex')
            switch (type) {
                case IxType.ExecuteSale:
                    payloads.push(getExecuteSaleInfo(tx, ix, index))
                    break;
                case IxType.Sell:
                    payloads.push(getSellInfo(tx, ix, index))
                    break;
                case IxType.CancelSell:
                    payloads.push(getCancelSellInfo(tx, ix, index))
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

async function magicedenV2(until) {
    const txs = await getLatestTxsUntilBlockTime(MAGICEDEN, until)
    const payloads = await processLatestTxs(txs)
    for (let i = 0; i < payloads.length; i++) {
      await uploadTxToDB(payloads[i])
    }
    return txs.length > 0 ? txs[txs.length - 1].blockTime : until
}

async function main() {
  let until = 1645506132
  while (true) {
    let prev_until = until
    await timer(1000)
    try {
      until = await magicedenV2(until)
    } catch (e) {
      until = prev_until
    }
  }
}

console.log('Running client.');
main().then(() => console.log(''));