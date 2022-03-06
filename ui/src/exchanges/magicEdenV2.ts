import * as anchor from "@project-serum/anchor";
import * as fs from "fs";
import { magicEdenV2IDL } from "./magicEdenIDL";
import { decodeMetadata, Metadata } from "./metadata_layout";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { Buffer } from "buffer";

const connection = new anchor.web3.Connection(
  "https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/"
);

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
export const magicEdenV2 = new anchor.web3.PublicKey(
  "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
);
const MEdenAutority = new anchor.web3.PublicKey(
  "1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix"
);
const MEAuctionCreator = new anchor.web3.PublicKey(
  "autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2"
);
const MEdenFee = new anchor.web3.PublicKey(
  "rFqFJ9g7TGBD8Ed7TPDnvGKZ5pWLPDyxLcvcH2eRCtt"
);
let MEHouse = new PublicKey("E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe");
let MEAuctionBump = 250;

async function getSellerTradeState(
  seller: anchor.web3.PublicKey,
  sellerAta: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("m2"),
      seller.toBuffer(),
      MEHouse.toBuffer(),
      sellerAta.toBuffer(),
      mint.toBuffer(),
    ],
    magicEdenV2
  );
}

async function getBuyerTradeState(
  buyer: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("m2"), buyer.toBuffer(), MEHouse.toBuffer(), mint.toBuffer()],
    magicEdenV2
  );
}

async function getUserEscrow(user: anchor.web3.PublicKey) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("m2"), MEHouse.toBuffer(), user.toBuffer()],
    magicEdenV2
  );
}

async function getMetadataAccount(mint: anchor.web3.PublicKey) {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
}

export async function depositMEv2(
  maker: anchor.web3.PublicKey,
  makerNftAccount: anchor.web3.PublicKey,
  escrowAccount: anchor.web3.PublicKey,
  program: anchor.Program
) {
  return program.rpc.cancelEscrow({
    accounts: {
      initializer: maker,
      pdaDepositTokenAccount: makerNftAccount,
      pdaAccount: MEdenAutority,
      escrowAccount: escrowAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

export async function withdrawMEv2(
  maker: anchor.web3.PublicKey,
  makerNftAccount: anchor.web3.PublicKey,
  escrowAccount: anchor.web3.PublicKey,
  program: anchor.Program
) {
  return program.rpc.cancelEscrow({
    accounts: {
      initializer: maker,
      pdaDepositTokenAccount: makerNftAccount,
      pdaAccount: MEdenAutority,
      escrowAccount: escrowAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

export async function sellMEv2(
  seller: anchor.web3.PublicKey,
  sellerATA: anchor.web3.PublicKey,
  tokenAccount: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  const [sellerTradeState, bump] = await getSellerTradeState(
    seller,
    sellerATA,
    nftMint
  );
  const [metadata, _] = await getMetadataAccount(nftMint);
  return program.rpc.sell(
    bump,
    MEAuctionBump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        seller: seller,
        treasuryMint: SystemProgram.programId,
        sellerTokenAccount: tokenAccount,
        sellerAta: sellerATA,
        tokenMint: nftMint,
        mintMetadata: metadata,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        sellerTradeState: sellerTradeState,
        authority: MEAuctionCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenAccountProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        programAsSigner: MEdenAutority,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );
}

export async function cancelSellMEv2(
  seller: anchor.web3.PublicKey,
  sellerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  const [sellerTradeState, bump] = await getSellerTradeState(
    seller,
    sellerATA,
    nftMint
  );
  return program.rpc.cancelSell(
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        seller: seller,
        treasuryMint: SystemProgram.programId,
        sellerATA: sellerATA,
        mint: nftMint,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        sellerTradeState: sellerTradeState,
        authority: MEAuctionCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        programAsSigner: MEdenAutority,
      },
    }
  );
}

export async function buyMEv2(
  buyer: anchor.web3.PublicKey,
  seller: anchor.web3.PublicKey,
  sellerATA: anchor.web3.PublicKey,
  buyerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  metadataAccount: anchor.web3.PublicKey,
  creators: anchor.web3.PublicKey[],
  price: number,
  program: anchor.Program
) {
  let [userEscrow, bump] = await getUserEscrow(buyer);
  let priceBN = new anchor.BN(price * LAMPORTS_PER_SOL);
  let depositIx = await program.instruction.deposit(bump, priceBN, {
    accounts: {
      user: buyer,
      treasuryMint: SystemProgram.programId,
      userEscrow: userEscrow,
      auctionCreator: MEAuctionCreator,
      auctionHouse: MEHouse,
      systemProgram: SystemProgram.programId,
    },
  });

  let [buyerTradeState, bumpp] = await getBuyerTradeState(buyer, nftMint);
  let [sellerTradeState, dc] = await getSellerTradeState(
    seller,
    sellerATA,
    nftMint
  );
  let buyIx = await program.instruction.buy(
    bumpp,
    bump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    {
      accounts: {
        buyer: buyer,
        treasuryMint: SystemProgram.programId,
        mint: nftMint,
        mintMetadata: metadataAccount,
        buyerEscrow: userEscrow,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        buyerTradeState: buyerTradeState,
        authority: MEAuctionCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );

  let execSaleIx = await program.instruction.executeSale(
    bump,
    MEAuctionBump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        buyer: buyer,
        seller: seller,
        treasuryMint: SystemProgram.programId,
        sellerATA: sellerATA,
        tokenMint: nftMint,
        mintMetadata: metadataAccount,
        buyerEscrow: userEscrow,
        buyerATA: buyerATA,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        auctionFee: MEdenFee,
        buyerTradeState: buyerTradeState,
        authority: MEAuctionCreator,
        sellerTradeState: sellerTradeState,
        eauthority: MEAuctionCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenAccountProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        programAsSigner: MEdenAutority,
        rent: SYSVAR_RENT_PUBKEY,
      },
      remainingAccounts: creators,
    }
  );
  let tx = new anchor.web3.Transaction({
    feePayer: buyer,
  });
  // @ts-ignore
  tx.add(...[depositIx, buyIx, execSaleIx]);
  return tx;
}

export async function offerMEv2(
  buyer: anchor.web3.PublicKey,
  // seller: anchor.web3.PublicKey,
  // sellerATA: anchor.web3.PublicKey,
  // buyerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  let [userEscrow, bump] = await getUserEscrow(buyer);
  let priceBN = new anchor.BN(price * LAMPORTS_PER_SOL);
  let depositIx = await program.instruction.deposit(bump, priceBN, {
    accounts: {
      user: buyer,
      treasuryMint: SystemProgram.programId,
      userEscrow: userEscrow,
      auctionCreator: MEAuctionCreator,
      auctionHouse: MEHouse,
      systemProgram: SystemProgram.programId,
    },
  });
  console.log(userEscrow.toBase58());

  let [buyerTradeState, bumpp] = await getBuyerTradeState(buyer, nftMint);
  let [metadataAccount, _] = await getMetadataAccount(nftMint);
  let buyIx = await program.instruction.buy(
    bumpp,
    bump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    {
      accounts: {
        buyer: buyer,
        treasuryMint: SystemProgram.programId,
        mint: nftMint,
        mintMetadata: metadataAccount,
        buyerEscrow: userEscrow,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        buyerTradeState: buyerTradeState,
        authority: MEAuctionCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );

  let tx = new anchor.web3.Transaction({
    feePayer: buyer,
  });
  // @ts-ignore
  // tx.add(...[buyIx]);
  tx.add(...[depositIx, buyIx]);
  // return sendAndConfirmTransaction(connection, tx, [keypair1]);
  return tx;
}

export async function cancelOfferMEv2(
  buyer: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  let [buyerTradeState, bumpp] = await getBuyerTradeState(buyer, nftMint);
  let [userEscrow, bump] = await getUserEscrow(buyer);
  let cancelOfferIx = await program.instruction.cancelBuy(
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    {
      accounts: {
        buyer: buyer,
        treasuryMint: SystemProgram.programId,
        mint: nftMint,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        buyerTradeState: buyerTradeState,
        authority: MEAuctionCreator,
      },
    }
  );
  let withdrawIx = await program.instruction.withdraw(
    bump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    {
      accounts: {
        user: buyer,
        treasuryMint: SystemProgram.programId,
        userEscrow: userEscrow,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        systemProgram: SystemProgram.programId,
      },
    }
  );

  let tx = new anchor.web3.Transaction({
    feePayer: buyer,
  });
  // @ts-ignore
  // tx.add(...[cancelOfferIx]);
  tx.add(...[cancelOfferIx, withdrawIx]);
  // return sendAndConfirmTransaction(connection, tx, [keypair1]);
  return tx;
}

export async function acceptOfferMEv2(
  seller: anchor.web3.PublicKey,
  buyer: anchor.web3.PublicKey,
  tokenAccount: anchor.web3.PublicKey,
  sellerATA: anchor.web3.PublicKey,
  buyerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  metadataAccount: anchor.web3.PublicKey,
  creators: anchor.web3.PublicKey[],
  price: number,
  program: anchor.Program
) {
  const [sellerTradeState, bump] = await getSellerTradeState(
    seller,
    sellerATA,
    nftMint
  );
  const [buyerTradeState] = await getBuyerTradeState(buyer, nftMint);
  const [buyerEscrow, bumpp] = await getUserEscrow(buyer);
  let sellIx = program.instruction.sell(
    bump,
    MEAuctionBump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        seller: seller,
        treasuryMint: SystemProgram.programId,
        sellerTokenAccount: tokenAccount,
        sellerAta: sellerATA,
        tokenMint: nftMint,
        mintMetadata: metadataAccount,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        sellerTradeState: sellerTradeState,
        authority: MEAuctionCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenAccountProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        programAsSigner: MEdenAutority,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );

  let execSaleIx = await program.instruction.executeSale(
    bumpp,
    MEAuctionBump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        buyer: buyer,
        seller: seller,
        treasuryMint: SystemProgram.programId,
        sellerATA: sellerATA,
        tokenMint: nftMint,
        mintMetadata: metadataAccount,
        buyerEscrow: buyerEscrow,
        buyerATA: buyerATA,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        auctionFee: MEdenFee,
        buyerTradeState: buyerTradeState,
        authority: MEAuctionCreator,
        sellerTradeState: sellerTradeState,
        eauthority: MEAuctionCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenAccountProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        programAsSigner: MEdenAutority,
        rent: SYSVAR_RENT_PUBKEY,
      },
      remainingAccounts: creators,
    }
  );

  let tx = new anchor.web3.Transaction({
    feePayer: seller,
  });
  // @ts-ignore
  tx.add(...[sellIx, execSaleIx]);
  // return sendAndConfirmTransaction(connection, tx, [seller]);
  return tx;
}
