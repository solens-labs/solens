import * as anchor from "@project-serum/anchor";
import * as fs from "fs";
import MEdenIdl from "./magicEdenIDL";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

const rpcHost: any = process.env.REACT_APP_SOLANA_RPC_HOST;

const connection = new anchor.web3.Connection(rpcHost);

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
  const [escrowAccount, bump] = await getEscrowAccount(
    nftMint,
    takerPrice,
    maker
  );

  return program.rpc.initializeEscrow2(
    new anchor.BN(takerPrice * LAMPORTS_PER_SOL),
    bump,
    {
      accounts: {
        initializer: maker,
        initializerDepositTokenAccount: makerNftAccount,
        escrowAccount: escrowAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    }
  );
}

export async function cancelMEden(
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
  // let [metadataAccount, _] = await getMetadataAccount(nftMint);
  // let remAccounts = await getCreatorsList(metadataAccount);
  let remAccounts = creators;
  let priceBN = new anchor.BN(takerPrice * LAMPORTS_PER_SOL);
  return program.rpc.exchange2(priceBN, nftMint, {
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
