import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection } from "@metaplex/js";

export const getTokenMetadata = async (mint) => {
  const connection = new Connection("mainnet-beta");
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
};
