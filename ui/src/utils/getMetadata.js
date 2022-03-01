import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection } from "@metaplex/js";
import * as anchor from "@project-serum/anchor";

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST_BACKUP;

export const getTokenMetadata = async (mint) => {
  // const connection = new Connection("mainnet-beta");
  try {
    const connection = new anchor.web3.Connection(rpcHost);
    const mintKey = new PublicKey(mint);
    const metadataPDA = await Metadata.getPDA(mintKey);
    const tokenMetadata = await Metadata.load(connection, metadataPDA);

    const fullData = tokenMetadata.data;

    let detailedData = "";

    for (let i = 0; i < 4; i++) {
      try {
        detailedData = await fetch(tokenMetadata.data.data.uri)
          .then((response) => response.json())
          .then((data) => {
            return data;
          });

        break;
      } catch (e) {
        console.log(e);
        setTimeout(() => {}, 5);
      }
    }

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
