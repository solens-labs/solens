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

const MAGICEDEN = new PublicKey('MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8')

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
        type: 'buy',
        subtype: 'accept_offer',
        ix: index,
        tx: tx.transaction.signatures[0],
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
          await checkUpgradeAndHalt(ix, MAGICEDEN)
          if (ix.programId.toBase58() == MAGICEDEN.toBase58()) {
            let ixData = base58.decode(ix.data)
            let type = ixData.slice(0, 8).toString('hex')
            switch (type) {
              case IxType.List:
                payloads.push(getListTxInfo(tx, ix, index))
                break;
              case IxType.OldList:
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
        } catch {}
      }
    } catch {}
  }
  return payloads
}

async function magiceden(until) {
  const txs = await getLatestTxsUntilBlockTime(MAGICEDEN, until)
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
