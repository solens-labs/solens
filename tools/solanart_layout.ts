import { BN } from '@project-serum/anchor';
import {PublicKey, SystemProgram} from '@solana/web3.js';
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {BinaryReader, BinaryWriter, deserializeUnchecked} from 'borsh';
import base58 from 'bs58';

type StringPublicKey = string;


enum InstructionVariant {
    List= 4,
    Buy,
    Update,
}



export const ListKeys = [
  {pubkey: new PublicKey(0), isSigner: true, isWritable: false}, // maker
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // exchangeFeeAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // escrowTokenAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // escrowAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // mint
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // makerTokenAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // rentProgram
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // systemProgram
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // tokenProgram
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // randomPublicKey
];

export const BuyKeys = [
  {pubkey: new PublicKey(0), isSigner: true, isWritable: false}, // taker
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // takerTokenAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // escrowTokenAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // maker
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // escrowAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // tokenProgram
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // exchangeFeeAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // escrowAuthority
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // mintMetadataAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // unknownPda
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // unknownPdaProgram
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // systemProgram
];

export const UpdateKeys = [
  {pubkey: new PublicKey(0), isSigner: true, isWritable: false}, // maker
  {pubkey: new PublicKey(0), isSigner: false, isWritable: true}, // escrowAccount
  {pubkey: new PublicKey(0), isSigner: false, isWritable: false}, // mint
];



class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
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
                ["price", "u64"]
            ]
        }
    ]

])

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
        value: StringPublicKey,
    ) {
        const writer = this as unknown as BinaryWriter;
        writer.writeFixedArray(base58.decode(value));
    };
};

extendBorsh();




