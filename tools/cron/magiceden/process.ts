import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const base58 = require("base-x")(BASE58);

const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/', {
    wsEndpoint: 'wss://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/'
})
let notified = false
let id = connection.onProgramAccountChange(new PublicKey('MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8'), (keyedAccountInfo, context) => {
    notified = true
}, 'processed')
const MAGICEDEN = new PublicKey('MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8')
const TRANSACTION_URI = 'http://localhost:3000/transactions'
const COLLECTION_URI = 'http://localhost:3000/collections/'


enum IxType {
    List = '96d480ba74018371',
    Cancel = '9ccb36b326482115',
    Buy = '438e36d81f1d1b5c',
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

async function getLatestTxs(until) {
    let before = null;
    let latestTxs = []
    while (true) {
        let confirmedSigs = await connection.getConfirmedSignaturesForAddress2(MAGICEDEN, {before: before}, "finalized")
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

async function processLatestTxs(latestTxs) {
    let payloads = []
    latestTxs.forEach((tx) => {
        tx.transaction.message.instructions.forEach((ix, index) => {
            if (ix.programId.toBase58() == MAGICEDEN.toBase58()) {
                let ixData = base58.decode(ix.data)
                let type = ixData.slice(0, 8).toString('hex')
                switch (type) {
                    case IxType.List:
                        payloads.push(getListTxInfo(tx, ix, index))
                        break;
                    case IxType.Cancel:
                        payloads.push(getCancelTxInfo(tx, ix, index))
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


function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function magiceden(until) {
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
    let last = await connection.getTransaction('395My1gJC1UmchM94AqXhwxGhwrgzKFJa5ccuM4og5eHvJzo3ZutdcQP646VQQFfxRGqUcTTWozjsUB867Aw2JGG')
    let block = await connection.getBlock(last.slot)
    let until = block.parentSlot
    let new_until;

    while (true) {
        if (notified) {
            notified = false
            try {
                new_until = await magiceden(until)
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