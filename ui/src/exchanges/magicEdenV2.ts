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

const keypair: any = anchor.web3.Keypair.generate();
const keypair1: any = anchor.web3.Keypair.generate();

// const keypair = anchor.web3.Keypair.fromSecretKey(
//   new Uint8Array(JSON.parse(fs.readFileSync(path).toString()))
// );
// const keypair1 = anchor.web3.Keypair.fromSecretKey(
//   new Uint8Array(JSON.parse(fs.readFileSync(path1).toString()))
// );
// const walletWrapper = new anchor.Wallet(keypair);
// const provider = new anchor.Provider(connection, walletWrapper, {
//   skipPreflight: false,
//   preflightCommitment: "recent",
// });

// const enum action {
//   Stale,
//   Sell,
//   Buy,
//   Offer,
//   CancelSell,
//   CancelOffer,
//   AcceptOffer,
// }

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

async function depositMEv2(
  maker: anchor.web3.Keypair,
  makerNftAccount: anchor.web3.PublicKey,
  escrowAccount: anchor.web3.PublicKey,
  program: anchor.Program
) {
  return program.rpc.cancelEscrow({
    accounts: {
      initializer: maker.publicKey,
      pdaDepositTokenAccount: makerNftAccount,
      pdaAccount: MEdenAutority,
      escrowAccount: escrowAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

async function withdrawMEv2(
  maker: anchor.web3.Keypair,
  makerNftAccount: anchor.web3.PublicKey,
  escrowAccount: anchor.web3.PublicKey,
  program: anchor.Program
) {
  return program.rpc.cancelEscrow({
    accounts: {
      initializer: maker.publicKey,
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

async function cancelSellMEv2(
  seller: anchor.web3.Keypair,
  sellerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  const [sellerTradeState, bump] = await getSellerTradeState(
    seller.publicKey,
    sellerATA,
    nftMint
  );
  return program.rpc.cancelSell(
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        seller: seller.publicKey,
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

async function buyMEv2(
  buyer: anchor.web3.Keypair,
  seller: anchor.web3.PublicKey,
  sellerATA: anchor.web3.PublicKey,
  buyerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  let [userEscrow, bump] = await getUserEscrow(buyer.publicKey);
  let priceBN = new anchor.BN(price * LAMPORTS_PER_SOL);
  let depositIx = await program.instruction.deposit(bump, priceBN, {
    accounts: {
      user: buyer.publicKey,
      treasuryMint: SystemProgram.programId,
      userEscrow: userEscrow,
      auctionCreator: MEAuctionCreator,
      auctionHouse: MEHouse,
      systemProgram: SystemProgram.programId,
    },
  });

  let [buyerTradeState, bumpp] = await getBuyerTradeState(
    buyer.publicKey,
    nftMint
  );
  let [sellerTradeState, dc] = await getSellerTradeState(
    seller,
    sellerATA,
    nftMint
  );
  let [metadataAccount, _] = await getMetadataAccount(nftMint);
  let buyIx = await program.instruction.buy(
    bumpp,
    bump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    {
      accounts: {
        buyer: buyer.publicKey,
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

  // let remAccounts = await getCreatorsList(metadataAccount);
  let execSaleIx = await program.instruction.executeSale(
    bump,
    MEAuctionBump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        buyer: buyer.publicKey,
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
      // remainingAccounts: remAccounts,
    }
  );
  let tx = new anchor.web3.Transaction({
    feePayer: keypair1.publicKey,
  });
  // @ts-ignore
  tx.add(...[depositIx, buyIx, execSaleIx]);
  return sendAndConfirmTransaction(connection, tx, [keypair1]);
}

async function offerMEv2(
  buyer: anchor.web3.Keypair,
  seller: anchor.web3.PublicKey,
  sellerATA: anchor.web3.PublicKey,
  buyerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  let [userEscrow, bump] = await getUserEscrow(buyer.publicKey);
  let priceBN = new anchor.BN(price * LAMPORTS_PER_SOL);
  let depositIx = await program.instruction.deposit(bump, priceBN, {
    accounts: {
      user: buyer.publicKey,
      treasuryMint: SystemProgram.programId,
      userEscrow: userEscrow,
      auctionCreator: MEAuctionCreator,
      auctionHouse: MEHouse,
      systemProgram: SystemProgram.programId,
    },
  });

  let [buyerTradeState, bumpp] = await getBuyerTradeState(
    buyer.publicKey,
    nftMint
  );
  let [metadataAccount, _] = await getMetadataAccount(nftMint);
  let buyIx = await program.instruction.buy(
    bumpp,
    bump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    {
      accounts: {
        buyer: buyer.publicKey,
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
    feePayer: keypair1.publicKey,
  });
  // @ts-ignore
  tx.add(...[depositIx, buyIx]);
  return sendAndConfirmTransaction(connection, tx, [keypair1]);
}

async function cancelOfferMEv2(
  buyer: anchor.web3.Keypair,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  let [buyerTradeState, bumpp] = await getBuyerTradeState(
    buyer.publicKey,
    nftMint
  );
  let [userEscrow, bump] = await getUserEscrow(buyer.publicKey);
  let cancelOfferIx = await program.instruction.cancelBuy(
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN(0),
    {
      accounts: {
        buyer: buyer.publicKey,
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
        user: buyer.publicKey,
        treasuryMint: SystemProgram.programId,
        userEscrow: userEscrow,
        auctionCreator: MEAuctionCreator,
        auctionHouse: MEHouse,
        systemProgram: SystemProgram.programId,
      },
    }
  );

  let tx = new anchor.web3.Transaction({
    feePayer: keypair1.publicKey,
  });
  // @ts-ignore
  tx.add(...[cancelOfferIx, withdrawIx]);
  return sendAndConfirmTransaction(connection, tx, [keypair1]);
}

async function acceptOfferMEv2(
  seller: anchor.web3.Keypair,
  buyer: anchor.web3.PublicKey,
  tokenAccount: anchor.web3.PublicKey,
  sellerATA: anchor.web3.PublicKey,
  buyerATA: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  const [sellerTradeState, bump] = await getSellerTradeState(
    seller.publicKey,
    sellerATA,
    nftMint
  );
  const [buyerTradeState] = await getBuyerTradeState(buyer, nftMint);
  const [userEscrow, bumpp] = await getUserEscrow(buyer);
  const [metadata] = await getMetadataAccount(nftMint);
  let sellIx = program.instruction.sell(
    bump,
    MEAuctionBump,
    new anchor.BN(price * LAMPORTS_PER_SOL),
    new anchor.BN(1),
    new anchor.BN("ffffffffffffffff", "hex"),
    {
      accounts: {
        seller: seller.publicKey,
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

  // let remAccounts = await getCreatorsList(metadata);
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
        seller: seller.publicKey,
        treasuryMint: SystemProgram.programId,
        sellerATA: sellerATA,
        tokenMint: nftMint,
        mintMetadata: metadata,
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
      // remainingAccounts: remAccounts,
    }
  );

  let tx = new anchor.web3.Transaction({
    feePayer: seller.publicKey,
  });
  // @ts-ignore
  tx.add(...[sellIx, execSaleIx]);
  return sendAndConfirmTransaction(connection, tx, [seller]);
}

// async function main() {
//   let seller = keypair;
//   let buyer = keypair1;
//   let nftMint = new anchor.web3.PublicKey(
//     "6eZEZWSbo7YPxgyk8S3zE9gqJxzgYfL5JHesAJLdcVkV"
//   );
//   let tokenAccount = new anchor.web3.PublicKey(
//     "2bZPBDBVHfJqauscYFNZAHaakkPd6meJC2kayi5sevTb"
//   );
//   let sellerATA = await Token.getAssociatedTokenAddress(
//     ASSOCIATED_TOKEN_PROGRAM_ID,
//     TOKEN_PROGRAM_ID,
//     nftMint,
//     seller.publicKey,
//     false
//   );
//   let buyerATA = await Token.getAssociatedTokenAddress(
//     ASSOCIATED_TOKEN_PROGRAM_ID,
//     TOKEN_PROGRAM_ID,
//     nftMint,
//     buyer.publicKey,
//     false
//   );
//   let price = 0.2;
//   let select = action.Stale;
//   switch (select) {
//     // @ts-ignore
//     case action.Stale:
//       break;
//     // @ts-ignore
//     case action.Sell:
//       let sellTxId = await sellMEv2(
//         seller,
//         sellerATA,
//         sellerATA,
//         nftMint,
//         price
//       );
//       console.log(sellTxId);
//       break;
//     // @ts-ignore
//     case action.CancelSell:
//       let cancelSellTxId = await cancelSellMEv2(
//         seller,
//         sellerATA,
//         nftMint,
//         price
//       );
//       console.log(cancelSellTxId);
//       break;
//     // @ts-ignore
//     case action.Buy:
//       let buyTxId = await buyMEv2(
//         buyer,
//         seller.publicKey,
//         sellerATA,
//         buyerATA,
//         nftMint,
//         price
//       );
//       console.log(buyTxId);
//       break;
//     // @ts-ignore
//     case action.Offer:
//       price = 0.1;
//       let offerTxId = await offerMEv2(
//         buyer,
//         seller.publicKey,
//         sellerATA,
//         buyerATA,
//         nftMint,
//         price
//       );
//       console.log(offerTxId);
//       break;
//     // @ts-ignore
//     case action.CancelOffer:
//       price = 0.1;
//       let cancelOfferTxId = await cancelOfferMEv2(buyer, nftMint, price);
//       console.log(cancelOfferTxId);
//       break;
//     // @ts-ignore
//     case action.AcceptOffer:
//       price = 0.1;
//       let acceptOfferTxId = await acceptOfferMEv2(
//         seller,
//         buyer.publicKey,
//         sellerATA,
//         sellerATA,
//         buyerATA,
//         nftMint,
//         price
//       );
//       console.log(acceptOfferTxId);
//       break;
//     default:
//       break;
//   }
//   return;
// }

// console.log("Running client.");
// main().then(() => console.log("Success"));
