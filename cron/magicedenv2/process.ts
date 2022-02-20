// @ts-nocheck
import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58 = require("base-x")(BASE58);

const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/', {
    wsEndpoint: 'wss://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/'
})

const MAGICEDEN = new PublicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K')
const BPF_UPGRADABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')
const TRANSACTION_URI = 'http://localhost:3000/transactions'
const COLLECTION_URI = 'http://localhost:3000/collections/'


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

async function getLatestTxs(until) {
    let before = null;
    let latestTxs = []
    while (true) {
        let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(MAGICEDEN, {before: before}, "confirmed")
        let sigs = []
        confirmedSigs.forEach((r) => {
            r.slot >= until && !r.err ? sigs.push(r.signature) : null;
        })
        let confirmedTxs = await connection.getParsedConfirmedTransactions(sigs, 'confirmed')
        sigs.forEach((sig) => {
            latestTxs.push(confirmedTxs.find(tx => tx.transaction.signatures.includes(sig)))
        })
        if (confirmedSigs[confirmedSigs.length - 1].slot < until) {
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

function getExecuteSaleInfo(tx, ix, index) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let type = 'unknown';
    let buyer = accounts[0]
    let seller = accounts[1]
    accountKeys.forEach((a) => {
        if (a.pubkey.toBase58() == buyer.toBase58()) {
            a.signer ? type = 'sale' : null
        } else if (a.pubkey.toBase58() == seller.toBase58()) {
            a.signer ? type = 'acceptOffer' : null
        }
    })
    let res = new tx_info({
        mint: accounts[4].toBase58(),
        owner: accounts[1].toBase58(),
        new_owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(10, 18), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'magicedenV2',
        type: type,
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
        marketplace: 'magicedenV2',
        escrow: accounts[8].toBase58(),
        type: 'sell',
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
    transferIxs = transferIxs.slice(0, transferIxs.length - 1)
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
        type: 'acceptOffer',
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
                    case IxType.ExecuteSale:
                        payloads.push(getExecuteSaleInfo(tx, ix, index))
                        break;
                    case IxType.Sell:
                        payloads.push(getSellInfo(tx, ix, index))
                        break;
                    // case IxType.OldBuy:
                    //     payloads.push(getOldBuyTxInfo(tx, ix, index))
                    //     break;
                    // case IxType.Buy:
                    //     payloads.push(getBuyTxInfo(tx, ix, index))
                    //     break;
                    // case IxType.AcceptOffer:
                    //     payloads.push(getAcceptOfferTxInfo(tx, ix, index))
                    //     break;
                    default:
                        break;
                }
            }
        })
    })
    return payloads
}


function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function magicedenV2(until) {
    const txs = await getLatestTxs(until)
    const payload = await processLatestTxs(txs)
    payload.forEach((p) => {
        console.log(p)
        console.log()
    })
    console.log(payload.length)
    return txs.length > 0 ? txs[0].slot : until
}


async function main() {
    let last = await connection.getTransaction('5kBDiwfC8VummLZw3uf5gQc1QcM83q1RiGZgxexbVC3YBBLMgrqTBzV9tyqQwu4ShC4hvqGohMTT1hXA2PZ6Pa8K')
    let block = await connection.getBlock(last.slot)
    let until = block.parentSlot
    let new_until;

    while (true) {
        try {
            new_until = await magicedenV2(until)
            if (new_until != until) {
                block = await connection.getBlock(new_until, {commitment:"confirmed"})
                until = block.parentSlot
            }
        } catch (e) {
            await sleep((500 * 64) / 160)
            continue
        }
        await sleep((500 * 64) / 160)
    }

}


console.log('Running client.');
main().then(() => console.log(''));