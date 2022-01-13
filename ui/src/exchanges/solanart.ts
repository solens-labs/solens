import * as anchor from "@project-serum/anchor";
import * as fs from "fs";
import MEdenIdl from "./magicEdenIDL";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

export async function buyMEden(
  buyer: anchor.web3.PublicKey,
  seller: anchor.web3.PublicKey,
  makerNftAccount: anchor.web3.PublicKey,
  escrowAccount: anchor.web3.PublicKey,
  metadataAccount: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  takerPrice: number,
  program: anchor.Program,
  creators: any
) {
  //   // let [metadataAccount, _] = await getMetadataAccount(nftMint);
  //   // let remAccounts = await getCreatorsList(metadataAccount);
  //   let remAccounts = creators;
  //   let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL);
  //   return program.rpc.exchange2(priceBN, nftMint, {
  //     accounts: {
  //       taker: buyer,
  //       pdaDepositTokenAccount: makerNftAccount,
  //       initializerMainAccount: seller,
  //       escrowAccount: escrowAccount,
  //       pdaAccount: MEdenAutority,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       systemProgram: SystemProgram.programId,
  //       platformFeesAccount: MEdenFee,
  //       metadataAccount: metadataAccount,
  //     },
  //     remainingAccounts: remAccounts,
  //   });
}
