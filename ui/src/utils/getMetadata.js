import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection } from "@metaplex/js";
import * as anchor from "@project-serum/anchor";

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

export const getTokenMetadata = async (mint) => {
  // const connection = new Connection("mainnet-beta");
  try {
    const connection = new anchor.web3.Connection(rpcHost);
    const mintKey = new PublicKey(mint);
    const metadataPDA = await Metadata.getPDA(mintKey);
    const tokenMetadata = await Metadata.load(connection, metadataPDA);

    const fullData = tokenMetadata.data;

    const detailedData = await fetch(tokenMetadata.data.data.uri)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    detailedData["mint"] = fullData.mint;

    return detailedData;
  } catch {
    console.log("Invalid Mint Address");
    return { invalid: true };
  }
};
