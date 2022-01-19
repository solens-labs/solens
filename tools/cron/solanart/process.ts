import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58 = require("base-x")(BASE58);

const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/', {
    wsEndpoint: 'wss://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/'
})
let notified = false
let id = connection.onProgramAccountChange(new PublicKey('CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz'), (keyedAccountInfo, context) => {
    notified = true
}, 'processed')
const SOLANART = new PublicKey('CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz')
const BPF_UPGRADABLE = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')
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

async function getLatestTxs(until) {
    let before = null;
    let latestTxs = []
    while (true) {
        let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(SOLANART, {before: before}, 'finalized')
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


function getAcceptOfferTxInfo(tx, ix, index) {
    let accounts = ix.accounts;
    let res = new tx_info({
        mint: accounts[3].toBase58(),
        owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'solanart',
        escrow: accounts[1].toBase58(),
        type: 'acceptOffer',
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
        date: tx.blockTime * 1000 + index,
        marketplace: 'solanart',
        escrow: accounts[3].toBase58(),
        type: 'list',
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
    let type;
    accounts[3].toBase58() == accounts[0].toBase58() ? type = 'cancel' : type = 'buy';
    let res = new tx_info({
        mint: getMintFromTx(tx.meta.postTokenBalances, mintIdx),
        owner: accounts[3].toBase58(),
        new_owner: accounts[0].toBase58(),
        price: type == 'buy' ? new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL : 0,
        date: tx.blockTime * 1000 + index,
        marketplace: 'solanart',
        escrow: accounts[4].toBase58(),
        type: type,
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}

function getUpdateTxInfo(tx, ix, index) {
    let accounts = ix.accounts;
    let res = new tx_info({
        mint: accounts[2].toBase58(),
        owner: accounts[0].toBase58(),
        price: new BN(base58.decode(ix.data).slice(1, 9), 'le').toNumber() / LAMPORTS_PER_SOL,
        date: tx.blockTime * 1000 + index,
        marketplace: 'solanart',
        escrow: accounts[1].toBase58(),
        type: 'update',
        ix: index,
        tx: tx.transaction.signatures[0],
    })
    return res
}


function checkUpgrade(ix) {
    return ix.programId.toBase58() == BPF_UPGRADABLE.toBase58() && ix.parsed.info.programAccount == SOLANART.toBase58()
}


async function processLatestTxs(latestTxs) {
    let payloads = []
    latestTxs.forEach((tx) => {
        tx.transaction.message.instructions.forEach((ix, index) => {
            if (checkUpgrade(ix)) {
                // error
                process.exit(-1)
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
        })
    })
    return payloads
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function solanart(until) {
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
    let last = await connection.getTransaction('3LPkPJDtpX9rEteEYS357FaVGMYnLrJEcWfHHpsVGK6ER1oCWkcevbGAgWNqpajiFq6Rj489KFkaP1wY2KeEpztg')
    let block = await connection.getBlock(last.slot)
    let until = block.parentSlot
    let new_until;

    while (true) {
        if (notified) {
            notified = false
            try {
                new_until = await solanart(until)
                if (new_until != until) {
                    block = await connection.getBlock(new_until)
                    until = block.parentSlot
                }
            } catch (e) {
                await sleep((250 * 64) / 160)
                continue
            }

        }
        await sleep((250 * 64) / 160)
    }
}


console.log('Running client.');
main().then(() => console.log(''));