import * as anchor from "@project-serum/anchor"
import * as fs from "fs";
import {Eden, MAGICEDEN_SCHEMA, MEdenIdl} from "./me_layout";
import {decodeMetadata, Metadata} from "./metadata_layout";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {LAMPORTS_PER_SOL, SystemProgram} from "@solana/web3.js";
import {deserializeUnchecked} from "borsh";

const connection = new anchor.web3.Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/')

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
const magicEden = new anchor.web3.PublicKey('MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8')
const MEdenAutority = new anchor.web3.PublicKey('GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp')
const MEdenFee = new anchor.web3.PublicKey('2NZukH2TXpcuZP4htiuT8CFxcaQSWzkkR6kepSWnZ24Q')

const path = '/Users/sina/.config/solana/93.json'
const path1 = '/Users/sina/.config/solana/90.json'
const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(path).toString())));
const keypair1 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(path1).toString())));
const walletWrapper = new anchor.Wallet(keypair);
const provider = new anchor.Provider(connection, walletWrapper, {
    preflightCommitment: 'recent',
});

// @ts-ignore
const program = new anchor.Program(MEdenIdl, magicEden, provider)


const enum action {
    Stale,
    List,
    Cancel,
    Buy,
}


async function getEscrowAccount(mint: anchor.web3.PublicKey, price: number, walletKey: anchor.web3.PublicKey) {
    const priceBN = new anchor.BN(price * LAMPORTS_PER_SOL)
    return anchor.web3.PublicKey.findProgramAddress([
        Buffer.from(anchor.utils.bytes.utf8.encode('escrow')),
        mint.toBuffer(),
        Buffer.from([...priceBN.toArray('le', 8)]),
        walletKey.toBuffer()
    ], magicEden)
}

async function getMetadataAccount(mint: anchor.web3.PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
        [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID,
    )
}

async function getCreatorsList(metadataAccount: anchor.web3.PublicKey) {
    let metadataAccountInfo = await connection.getAccountInfo(metadataAccount)
    let metadata = decodeMetadata(Buffer.from(metadataAccountInfo.data)) as Metadata
    let remainingAccounts = []
    metadata.data.creators.forEach((c) => {
        remainingAccounts.push({
            pubkey: new anchor.web3.PublicKey(c.address),
            isWritable: true,
            isSigner: false,
        })
    })
    return remainingAccounts
}


async function getEscrowAccountInfo(escrowAccount: anchor.web3.PublicKey){
    let escrowRaw = await connection.getAccountInfo(escrowAccount)
    return deserializeUnchecked(MAGICEDEN_SCHEMA, Eden, escrowRaw.data)
}


async function listMEden(maker: anchor.web3.Keypair, makerNftAccount: anchor.web3.PublicKey, nftMint: anchor.web3.PublicKey, takerPrice: number) {
    const [escrowAccount, bump] = await getEscrowAccount(nftMint, takerPrice, maker.publicKey)

    return program.rpc.initializeEscrow2(
        new anchor.BN(takerPrice * LAMPORTS_PER_SOL),
        bump,
        {
            accounts: {
                initializer: maker.publicKey,
                initializerDepositTokenAccount: makerNftAccount,
                escrowAccount: escrowAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId
            }
        }
    )
}

async function cancelMEden(maker: anchor.web3.Keypair, makerNftAccount: anchor.web3.PublicKey, escrowAccount: anchor.web3.PublicKey) {
    return program.rpc.cancelEscrow(
        {
            accounts: {
                initializer: maker.publicKey,
                pdaDepositTokenAccount: makerNftAccount,
                pdaAccount: MEdenAutority,
                escrowAccount: escrowAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
        }
    );
}

async function buyMEden(buyer: anchor.web3.Keypair,
                        seller: anchor.web3.PublicKey,
                        makerNftAccount: anchor.web3.PublicKey,
                        escrowAccount: anchor.web3.PublicKey,
                        nftMint: anchor.web3.PublicKey,
                        takerPrice: number) {
    let [metadataAccount, _] = await getMetadataAccount(nftMint)
    let remAccounts = await getCreatorsList(metadataAccount)
    let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL)
    return program.rpc.exchange2(priceBN, nftMint, {
            accounts: {
                taker: buyer.publicKey,
                pdaDepositTokenAccount: makerNftAccount,
                initializerMainAccount: seller,
                escrowAccount: escrowAccount,
                pdaAccount: MEdenAutority,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                platformFeesAccount: MEdenFee,
                metadataAccount: metadataAccount,
            },
            remainingAccounts: remAccounts,
        }
    )
}

async function main() {

    /*
        //TODO add comments later
    */
    let maker = keypair;
    let taker = keypair1;
    let makerNftAccount = new anchor.web3.PublicKey('4CFnmAMu6BDcpJRDu2WjqmtQ8BoAXs6MaTUkhqWVsPzt')
    let nftMint = new anchor.web3.PublicKey('3GRz6nPyjvgzQtTnWs1nkSyA6hbGqLBNTjqnXkPT3per')
    let escrowAccount, takerPrice;
    let select = action.List
    switch (select) {
        // @ts-ignore
        case action.Stale:
            break;
        // @ts-ignore
        case action.List:
            takerPrice = 0.5 // price in sol
            let listTxId = await listMEden(maker, makerNftAccount, nftMint, takerPrice);
            console.log(listTxId)
            break;
        // @ts-ignore
        case action.Cancel:
            escrowAccount = new anchor.web3.PublicKey('3EKQCd3d7yTw2G1UbxjeJJKxZuGv4DrQX7ZntrnPq4NM')
            let cancelTxId = await cancelMEden(maker, makerNftAccount, escrowAccount)
            console.log(cancelTxId)
            break;
        // @ts-ignore
        case action.Buy:
            takerPrice = 0.5 // price in sol
            escrowAccount = new anchor.web3.PublicKey('45KxGArrM6HuEWr96UVJT2KMouMnzU7XWDbmPw1o3HkD')
            let buyTxId = await buyMEden(taker, maker.publicKey, makerNftAccount, escrowAccount, nftMint, takerPrice)
            console.log(buyTxId)
            break;
        default:
            break;
    }
    return
}

console.log('Running client.');
main().then(() => console.log('Success'));