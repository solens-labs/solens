import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { BinaryReader, BinaryWriter, deserializeUnchecked } from "borsh";
import base58 from "bs58";

export const mintToken = () => {};
