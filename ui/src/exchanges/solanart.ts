import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  Connection,
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import * as fs from "fs";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BuyKeys, ListKeys } from "./solanartLayout";
import { Buffer } from "buffer";
import { decodeMetadata, Metadata } from "./metadata_layout";

const rpcHost: any = process.env.REACT_APP_SOLANA_RPC_HOST;

// const connection = new anchor.web3.Connection(rpcHost);
const connection = new Connection(rpcHost);

const Solanart = new PublicKey("CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz");
const stakeProgram = new PublicKey(
  "7gDpaG9kUXHTz1dj4eVfykqtXnKq2efyuGigdMeCy74B"
);
const exchangeFeeAccount = new PublicKey(
  "39fEpihLATXPJCQuSiXLUSiCbGchGYjeL39eyXh3KbyT"
);
const escrowAuthority = new PublicKey(
  "3D49QorJyNaL4rcpiynbuS3pRH4Y7EXEM6v6ZGaqfFGK"
);
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

enum action {
  Stale = 3,
  List,
  Buy,
  Update,
}

// async function getCreatorsList(metadataAccount: anchor.web3.PublicKey) {
//       let metadataAccountInfo = await connection.getAccountInfo(metadataAccount)
//       let metadata = decodeMetadata(Buffer.from(metadataAccountInfo.data)) as Metadata
//       let remainingAccounts: any = []
//       metadata.data.creators.forEach((c) => {
//           remainingAccounts.push({
//               pubkey: new anchor.web3.PublicKey(c.address),
//               isWritable: true,
//               isSigner: false,
//           })
//       })
//       return remainingAccounts
// }

export async function listSolanart(
  wallet: any,
  makerNftAccount: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  takerPrice: number
) {
  let escrowTokenAccount = Keypair.generate();
  let createTokenIx = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(165),
    newAccountPubkey: escrowTokenAccount.publicKey,
    programId: TOKEN_PROGRAM_ID,
    space: 165,
  });
  let initAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    nftMint,
    escrowTokenAccount.publicKey,
    wallet.publicKey
  );

  let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL);
  let ixData = Buffer.from([action.List, ...priceBN.toArray("le", 8)]);

  let [escrowAccount, bump] = await PublicKey.findProgramAddress(
    [Buffer.from("sale"), nftMint.toBuffer()],
    Solanart
  );
  let keys = [
    wallet.publicKey,
    exchangeFeeAccount,
    escrowTokenAccount.publicKey,
    escrowAccount,
    nftMint,
    makerNftAccount,
    SYSVAR_RENT_PUBKEY,
    SystemProgram.programId,
    TOKEN_PROGRAM_ID,
    Keypair.generate().publicKey,
  ];
  keys.forEach((k, index) => {
    ListKeys[index].pubkey = k;
  });

  let listIx = new TransactionInstruction({
    keys: ListKeys,
    data: ixData,
    programId: Solanart,
  });

  const final_tx = new Transaction({
    feePayer: wallet.publicKey,
  });

  final_tx.add(...[createTokenIx, initAccountIx, listIx]);

  return { final_tx, escrowTokenAccount };
}

export async function buySolanart(
  taker: anchor.web3.Keypair,
  maker: anchor.web3.PublicKey,
  makerNftAccount: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  takerPrice: number,
  creators: any
) {
  let txIxs = [];

  let takerAtaAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    nftMint,
    taker.publicKey
  );
  let takerAtaAccount = await connection.getAccountInfo(takerAtaAddress);
  if (takerAtaAddress == null) {
    let createTakerAtaIx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMint,
      takerAtaAddress,
      taker.publicKey,
      taker.publicKey
    );
    txIxs.push(createTakerAtaIx);
  }

  takerPrice = taker.publicKey.toBase58() == maker.toBase58() ? 0 : takerPrice;
  let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL);
  let ixData = Buffer.from([action.Buy, ...priceBN.toArray("le", 8)]);

  let [escrowAccount, bs] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("sale"), nftMint.toBuffer()],
    Solanart
  );
  let [mintMetadataAccount, bm] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        nftMint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
  let [stakePda, bn] = await PublicKey.findProgramAddress(
    [Buffer.from("nft"), maker.toBuffer()],
    stakeProgram
  );

  let keys = [
    taker.publicKey,
    takerAtaAddress,
    new PublicKey("2f8RUQFQ2BuDRcoshVoAc1xzHZqujA7Yoyhre21EPjhE"),
    maker,
    escrowAccount,
    TOKEN_PROGRAM_ID,
    exchangeFeeAccount,
    escrowAuthority,
    mintMetadataAccount,
    stakePda,
    stakeProgram,
    SystemProgram.programId,
  ];

  let accounts: any = [];
  keys.forEach((k, index) => {
    BuyKeys[index].pubkey = k;
    accounts.push(BuyKeys[index]);
  });

  accounts.push(...creators);
  console.log(accounts);

  let buyIx = new TransactionInstruction({
    programId: Solanart,
    data: ixData,
    keys: accounts,
  });

  txIxs.push(buyIx);

  const final_tx = new Transaction({
    feePayer: taker.publicKey,
  });

  final_tx.add(...txIxs);

  // return anchor.web3.sendAndConfirmTransaction(connection, final_tx, [taker], {
  //   skipPreflight: false,
  // });
}
