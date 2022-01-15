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
import { BinaryReader, BinaryWriter, deserializeUnchecked } from "borsh";
import base58 from "bs58";

const rpcHost: any = process.env.REACT_APP_SOLANA_RPC_HOST;
const connection = new Connection(rpcHost);

type StringPublicKey = string;
class Assignable {
  constructor(properties: any) {
    Object.keys(properties).map((key) => {
      // @ts-ignore
      return (this[key] = properties[key]);
    });
  }
}
export class SolanartEscrow extends Assignable {}
export const SOLANART_SCHEMA = new Map<any, any>([
  [
    SolanartEscrow,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["maker", "pubkeyAsString"],
        ["escrowTokenAccount", "pubkeyAsString"],
        ["price", "u64"],
      ],
    },
  ],
]);
export const extendBorsh = () => {
  (BinaryReader.prototype as any).readPubkey = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  (BinaryWriter.prototype as any).writePubkey = function (value: PublicKey) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(value.toBuffer());
  };

  (BinaryReader.prototype as any).readPubkeyAsString = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return base58.encode(array) as StringPublicKey;
  };

  (BinaryWriter.prototype as any).writePubkeyAsString = function (
    value: StringPublicKey
  ) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(base58.decode(value));
  };
};
extendBorsh();

export async function getEscrowAccountInfo(
  escrowAccount: anchor.web3.PublicKey
) {
  let escrowRaw = await connection.getAccountInfo(escrowAccount);
  if (escrowRaw) {
    // @ts-ignore
    return deserializeUnchecked(
      SOLANART_SCHEMA,
      SolanartEscrow,
      escrowRaw.data
    );
  }
}

export const Solanart = new PublicKey(
  "CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz"
);
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

export async function listSolanart(
  wallet: any,
  makerNftAccount: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  takerPrice: number,
  name: string,
  token_add: string,
  img_url: string
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

  let memoData =
    '{"name": "' +
    name +
    '", "desc": "' +
    "undefined" +
    '", "token_add": "' +
    token_add +
    '", "sale_add": "' +
    escrowAccount.toBase58() +
    '", "img_url":"' +
    img_url +
    '", "price_sol":"' +
    takerPrice +
    '"}';

  let memoIx = new TransactionInstruction({
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
    data: Buffer.from(memoData, "utf-8"),
    keys: [],
  });

  const final_tx = new Transaction({
    feePayer: wallet.publicKey,
  });
  final_tx.add(...[createTokenIx, initAccountIx, listIx, memoIx]);
  return { final_tx, escrowTokenAccount };
}

export async function buySolanart(
  taker: anchor.web3.PublicKey,
  maker: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  takerPrice: number,
  creators: any
) {
  let txIxs = [];

  let takerAtaAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    nftMint,
    taker
  );
  let takerAtaAccount = await connection.getAccountInfo(takerAtaAddress);
  if (takerAtaAccount == null) {
    let createTakerAtaIx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMint,
      takerAtaAddress,
      taker,
      taker
    );
    txIxs.push(createTakerAtaIx);
  }

  takerPrice = taker.toBase58() == maker.toBase58() ? 0 : takerPrice;
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

  let escrowAccountInfo = await getEscrowAccountInfo(escrowAccount);
  let depositNftAccount = escrowAccountInfo.escrowTokenAccount;

  let keys = [
    taker,
    takerAtaAddress,
    depositNftAccount,
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

  if (maker.toBase58() !== taker.toBase58()) {
    creators.forEach((c: any) => {
      accounts.push(c);
    });
  }

  let buyIx = new TransactionInstruction({
    programId: Solanart,
    data: ixData,
    keys: accounts,
  });

  txIxs.push(buyIx);

  const final_tx = new Transaction({
    feePayer: taker,
  });

  final_tx.add(...txIxs);

  // return anchor.web3.sendAndConfirmTransaction(connection, final_tx, [taker], {
  //   skipPreflight: false,
  // });
  return final_tx;
}
