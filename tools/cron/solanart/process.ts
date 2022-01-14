import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58 = require("base-x")(BASE58);

const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/')
const SOLANART = new PublicKey('CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz')
const TRANSACTION_URI = 'http://localhost:3000/transactions'
const COLLECTION_URI = 'http://localhost:3000/collections/'


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
        let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(SOLANART, {before: before})
        let sigs = []
        confirmedSigs.forEach((r) => {
            r.blockTime >= blockTime ? sigs.push(r.signature) : null;
        })
        let confirmedTxs = await connection.getParsedConfirmedTransactions(sigs)
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

function getListTxInfo(tx, ix) {
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
    })
    return res
}

function getBuyTxInfo(tx, ix) {
    let accountKeys = tx.transaction.message.accountKeys
    let accounts = ix.accounts;
    let mintIdx;
    accountKeys.forEach((k,index)=>{
        k.pubkey.toBase58() == accounts[1].toBase58() ? mintIdx = index : null;
    })
    let type;
    accounts[3].toBase58() == accounts[0].toBase58() ? type = 'cancel' : type = 'buy';
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
    })
    return res
}

function getUpdateTxInfo(tx, ix) {

    let accounts = ix.accounts;

    let res = new tx_info({
        mint: accounts[2].toBase58(),
        owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000,
        marketplace: 'solanart',
        escrow: accounts[1].toBase58(),
        type: 'update',
        tx: tx.transaction.signatures[0],
    })
    return res
}

async function processLatestTxs(latestTxs) {
    let payloads = []
    latestTxs.forEach((tx) => {
        tx.transaction.message.instructions.forEach((ix) => {
            if (ix.programId.toBase58() == SOLANART.toBase58()) {
                let ixData = base58.decode(ix.data)
                let type = new BN(ixData[0]).toNumber()
                switch (type) {
                    case 4:
                        payloads.push(getListTxInfo(tx, ix))
                        break;
                    case 5:
                        payloads.push(getBuyTxInfo(tx, ix))
                        break;
                    case 6:
                        payloads.push(getUpdateTxInfo(tx, ix))
                        break;
                    default:
                        break;
                }

            }
        })
    })
    return payloads
}


async function main() {
    let last = await connection.getTransaction('tVb97sj81o1DPEZhj5ic5Du5WrMeDhCFwr52ASNPpyTHH5Dz2gukLQT18AwKzEWxwHqZQcXAPBZB866ftERoaDU')
    let blockTime = await connection.getBlockTime(last.slot - 1)
    const txs = await getLatestTxs(blockTime)

    const payload = await processLatestTxs(txs)
    payload.forEach((p)=>{
        console.log(p)
        console.log()
    })
    // console.log(payload.length)
}


console.log('Running client.');


main().then(() => console.log(''));