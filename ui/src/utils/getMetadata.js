import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection } from "@metaplex/js";
import * as anchor from "@project-serum/anchor";

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

const fetchWithRetry = async (uri, retry) => {
  if (retry == 0) {
    return "";
  }
  console.log("retry", retry)
  return fetch(uri)
    .then(res => res.json())
    .catch(err => {
      return fetchWithRetry(uri, retry - 1)
    })
}

export const getTokenMetadata = async (mint) => {
  try {
    const connection = new anchor.web3.Connection(rpcHost);
    const mintKey = new PublicKey(mint);
    const metadataPDA = await Metadata.getPDA(mintKey);
    const tokenMetadata = await Metadata.load(connection, metadataPDA);

    const fullData = tokenMetadata.data;

    let detailedData = await fetchWithRetry(tokenMetadata.data.data.uri, 4);

    detailedData["mint"] = fullData.mint;
    detailedData["creators"] = fullData.data.creators;
    detailedData["creators_list"] = fullData.data.creators.map((c) => {
      return {
        pubkey: new anchor.web3.PublicKey(c.address),
        isWritable: true,
        isSigner: false,
      };
    });
    detailedData["metadata_acct"] = metadataPDA.toBase58();

    return detailedData;
  } catch (e) {
    // console.log("Invalid Mint Address");
    return { invalid: true };
  }
};
