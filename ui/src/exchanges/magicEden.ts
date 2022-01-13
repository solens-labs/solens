import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { BinaryReader, BinaryWriter, deserializeUnchecked } from "borsh";
import { PublicKey } from "@solana/web3.js";
import base58 from "bs58";

const rpcHost: any = process.env.REACT_APP_SOLANA_RPC_HOST;
const connection = new anchor.web3.Connection(rpcHost);
type StringPublicKey = string;
class Assignable {
  constructor(properties: any) {
    Object.keys(properties).map((key) => {
      // @ts-ignore
      return (this[key] = properties[key]);
    });
  }
}

export class Eden extends Assignable {}

export const MAGICEDEN_SCHEMA = new Map<any, any>([
  [
    Eden,
    {
      kind: "struct",
      fields: [
        ["discriminator", "u64"],
        ["initializer", "pubkeyAsString"],
        ["tokenAccount", "pubkeyAsString"],
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

async function getEscrowAccountInfo(escrowAccount: anchor.web3.PublicKey) {
  let escrowRaw = await connection.getAccountInfo(escrowAccount);
  // @ts-ignore
  return deserializeUnchecked(MAGICEDEN_SCHEMA, Eden, escrowRaw.data);
}

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
export const magicEden = new anchor.web3.PublicKey(
  "MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8"
);
const MEdenAutority = new anchor.web3.PublicKey(
  "GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp"
);
const MEdenFee = new anchor.web3.PublicKey(
  "2NZukH2TXpcuZP4htiuT8CFxcaQSWzkkR6kepSWnZ24Q"
);

export async function getEscrowAccount(
  mint: anchor.web3.PublicKey,
  price: number,
  walletKey: anchor.web3.PublicKey
) {
  const priceBN = new anchor.BN(price * LAMPORTS_PER_SOL);

  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("escrow")),
      mint.toBuffer(),
      Buffer.from([...priceBN.toArray("le", 8)]),
      walletKey.toBuffer(),
    ],
    magicEden
  );
}

export async function listMEden(
  maker: anchor.web3.PublicKey,
  makerNftAccount: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  takerPrice: number,
  program: anchor.Program
) {
  const priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL);
  const [escrowAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("escrow")),
      nftMint.toBuffer(),
      Buffer.from([...priceBN.toArray("le", 8)]),
      maker.toBuffer(),
    ],
    magicEden
  );

  return program.rpc.initializeEscrow2(priceBN, bump, {
    accounts: {
      initializer: maker,
      initializerDepositTokenAccount: makerNftAccount,
      escrowAccount: escrowAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
  });
}

export async function cancelMEden(
  maker: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program
) {
  const priceBN = new anchor.BN(price * LAMPORTS_PER_SOL);
  const [escrowAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("escrow")),
      mint.toBuffer(),
      Buffer.from([...priceBN.toArray("le", 8)]),
      maker.toBuffer(),
    ],
    magicEden
  );
  let escrowAccountInfo = await getEscrowAccountInfo(escrowAccount);
  const makerNftAccount = escrowAccountInfo.tokenAccount;
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

export async function buyMEden(
  seller: anchor.web3.PublicKey,
  buyer: anchor.web3.PublicKey,
  metadataAccount: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey,
  price: number,
  program: anchor.Program,
  creators: any
) {
  let remAccounts = creators;
  let priceBN = new anchor.BN(price * LAMPORTS_PER_SOL);
  const [escrowAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("escrow")),
      mint.toBuffer(),
      Buffer.from([...priceBN.toArray("le", 8)]),
      seller.toBuffer(),
    ],
    magicEden
  );
  let escrowAccountInfo = await getEscrowAccountInfo(escrowAccount);
  const makerNftAccount = escrowAccountInfo.tokenAccount;
  return program.rpc.exchange2(priceBN, mint, {
    accounts: {
      taker: buyer,
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
  });
}
