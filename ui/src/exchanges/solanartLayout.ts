import { BN } from "@project-serum/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

enum InstructionVariant {
  List = 4,
  Buy,
  Update,
}

export const ListKeys = [
  { pubkey: new PublicKey(0), isSigner: true, isWritable: false }, // maker
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // exchangeFeeAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // escrowTokenAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // escrowAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // mint
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // makerTokenAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // rentProgram
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // systemProgram
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // tokenProgram
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // randomPublicKey
];

export const BuyKeys = [
  { pubkey: new PublicKey(0), isSigner: true, isWritable: false }, // taker
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // takerTokenAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // escrowTokenAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // maker
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // escrowAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // tokenProgram
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // exchangeFeeAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // escrowAuthority
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // mintMetadataAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // unknownPda
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // unknownPdaProgram
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // systemProgram
];

export const UpdateKeys = [
  { pubkey: new PublicKey(0), isSigner: true, isWritable: false }, // maker
  { pubkey: new PublicKey(0), isSigner: false, isWritable: true }, // escrowAccount
  { pubkey: new PublicKey(0), isSigner: false, isWritable: false }, // mint
];
