import {
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import * as fs from "fs";
import {ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {BuyKeys, ListKeys, UpdateKeys} from "./solanart_layout";
import {Buffer} from "buffer";
import {decodeMetadata, Metadata} from "./metadata_layout";

const connection = new anchor.web3.Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/')

const Solanart = new PublicKey('CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz')
const stakeProgram = new PublicKey('7gDpaG9kUXHTz1dj4eVfykqtXnKq2efyuGigdMeCy74B')
const exchangeFeeAccount = new PublicKey('39fEpihLATXPJCQuSiXLUSiCbGchGYjeL39eyXh3KbyT')
const escrowAuthority = new PublicKey('3D49QorJyNaL4rcpiynbuS3pRH4Y7EXEM6v6ZGaqfFGK')
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')


const path = '/Users/sina/.config/solana/93.json'
const path1 = '/Users/sina/.config/solana/90.json'
const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(path).toString())));
const keypair1 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(path1).toString())));

const enum action {
    Stale = 3,
    List,
    Buy,
    Update,
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


async function listSolanart(maker: anchor.web3.Keypair, makerNftAccount: anchor.web3.PublicKey, nftMint: anchor.web3.PublicKey, takerPrice: number) {

    let escrowTokenAccount = Keypair.generate()
    let createTokenIx = SystemProgram.createAccount({
        fromPubkey: maker.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(165),
        newAccountPubkey: escrowTokenAccount.publicKey,
        programId: TOKEN_PROGRAM_ID,
        space: 165
    })
    let initAccountIx = Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        nftMint,
        escrowTokenAccount.publicKey,
        maker.publicKey)


    let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL)
    let ixData = Buffer.from([action.List, ...priceBN.toArray('le', 8)]);

    let [escrowAccount, bump] = await PublicKey.findProgramAddress([Buffer.from("sale"), nftMint.toBuffer()], Solanart)
    let keys = [
        maker.publicKey,
        exchangeFeeAccount,
        escrowTokenAccount.publicKey,
        escrowAccount,
        nftMint,
        makerNftAccount,
        SYSVAR_RENT_PUBKEY,
        SystemProgram.programId,
        TOKEN_PROGRAM_ID,
        Keypair.generate().publicKey
    ]
    keys.forEach((k, index) => {
        ListKeys[index].pubkey = k
    })

    let listIx = new TransactionInstruction({
        keys: ListKeys,
        data: ixData,
        programId: Solanart
    })

    const final_tx = new Transaction({
        feePayer: maker.publicKey
    });

    final_tx.add(...[createTokenIx, initAccountIx, listIx])

    return anchor.web3.sendAndConfirmTransaction(
        connection,
        final_tx,
        [maker, escrowTokenAccount],
        {skipPreflight: false}
    )

}

async function buySolanart(taker: anchor.web3.Keypair,
                           maker: anchor.web3.PublicKey,
                           makerNftAccount: anchor.web3.PublicKey,
                           nftMint: anchor.web3.PublicKey,
                           takerPrice: number) {

    let txIxs = []

    let takerAtaAddress = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, nftMint, taker.publicKey)
    let takerAtaAccount = await connection.getAccountInfo(takerAtaAddress)
    if (takerAtaAddress == null) {
        let createTakerAtaIx = Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, nftMint, takerAtaAddress, taker.publicKey, taker.publicKey)
        txIxs.push(createTakerAtaIx)
    }

    takerPrice = taker.publicKey.toBase58() == maker.toBase58() ? 0 : takerPrice
    let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL)
    let ixData = Buffer.from([action.Buy, ...priceBN.toArray('le', 8)]);

    let [escrowAccount, bs] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("sale"), nftMint.toBuffer()], Solanart)
    let [mintMetadataAccount, bm] = await anchor.web3.PublicKey.findProgramAddress(
        [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            nftMint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID,
    )
    let [stakePda, bn] = await PublicKey.findProgramAddress([Buffer.from("nft"), maker.toBuffer()], stakeProgram)

    let keys = [
        taker.publicKey,
        takerAtaAddress,
        new PublicKey('HQjo82y23sKLMJdSZRhYxHw1DRVpVwUNnpw1iYFbNgom'),
        maker,
        escrowAccount,
        TOKEN_PROGRAM_ID,
        exchangeFeeAccount,
        escrowAuthority,
        mintMetadataAccount,
        stakePda,
        stakeProgram,
        SystemProgram.programId
    ]


    let accounts = []
    keys.forEach((k, index) => {
        BuyKeys[index].pubkey = k
        accounts.push(BuyKeys[index])
    })

    if (takerPrice > 0) {
        let creators = await getCreatorsList(mintMetadataAccount)
        creators.forEach((c) => {
            accounts.push({
                pubkey: new anchor.web3.PublicKey(c.address),
                isWritable: true,
                isSigner: false
            })
        })
    }

    let buyIx = new TransactionInstruction({
        programId: Solanart,
        data: ixData,
        keys: accounts
    })

    txIxs.push(buyIx)


    const final_tx = new Transaction({
        feePayer: taker.publicKey
    });

    final_tx.add(...txIxs)


    return anchor.web3.sendAndConfirmTransaction(
        connection,
        final_tx,
        [taker],
        {skipPreflight: false}
    )

}


async function updateSolanart(maker: anchor.web3.Keypair, escrowAccount: anchor.web3.PublicKey, nftMint: anchor.web3.PublicKey, takerPrice: number) {
    let keys = [
        maker.publicKey,
        escrowAccount,
        nftMint
    ]

    keys.forEach((k, index) => {
        UpdateKeys[index].pubkey = k
    })

    let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL)
    let ixData = Buffer.from([action.Update, ...priceBN.toArray('le', 8)]);

    let updateIx = new TransactionInstruction({
        programId: Solanart,
        data: ixData,
        keys: UpdateKeys
    })


    let memoData = '{"name": "' + l +
        '", "desc": "' + b +
        '", "token_add": "' + n +
        '", "sale_add": "' + y.toString() +
        '", "img_url":"' + p +
        '", "price_sol":"' + h + '"}'
    let memoIx = new TransactionInstruction({
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(memoData, 'utf-8'),
        keys: []
    })

    const final_tx = new Transaction({
        feePayer: maker.publicKey
    });

    final_tx.add(...[updateIx])


    return anchor.web3.sendAndConfirmTransaction(
        connection,
        final_tx,
        [maker],
        {skipPreflight: false}
    )

}


async function main() {
    let maker = keypair;
    let taker = keypair1;
    let makerNftAccount = new anchor.web3.PublicKey('4CFnmAMu6BDcpJRDu2WjqmtQ8BoAXs6MaTUkhqWVsPzt')
    let nftMint = new anchor.web3.PublicKey('3GRz6nPyjvgzQtTnWs1nkSyA6hbGqLBNTjqnXkPT3per')
    let escrowAccount, takerPrice;
    let select = action.Buy
    switch (select) {
        // @ts-ignore
        case action.Stale:
            break;
        // @ts-ignore
        case action.List:
            takerPrice = 0.5 // price in sol
            let listTxId = await listSolanart(maker, makerNftAccount, nftMint, takerPrice);
            console.log(listTxId)
            break;
        // @ts-ignore
        case action.Buy:
            takerPrice =  // price in sol
            let buyTxId = await buySolanart(taker, maker.publicKey, makerNftAccount, nftMint, takerPrice)
            console.log(buyTxId)
            break;
        // @ts-ignore
        case action.Update:
            takerPrice = 1 // price in sol
            let [escrowAccount, bump] = await PublicKey.findProgramAddress([Buffer.from("sale"), nftMint.toBuffer()], Solanart)
            let cancelTxId = await updateSolanart(maker, escrowAccount, nftMint, takerPrice)
            console.log(cancelTxId)
            break;
        default:
            break;
    }
}


console.log('Running client.');
main().then(() => console.log(''));