import React, { useEffect, useState } from "react";
import { Connection, programs } from "@metaplex/js";
import "./style.css";
import Attribute from "../Attribute";

export default function NftTokenCard(props) {
  const { nftData } = props;
  const address = nftData.mint;
  //   console.log(address);

  const connection = new Connection("mainnet-beta");
  const [tokenData, setTokenData] = useState([]);
  const [tokenMetadata, setTokenMetadata] = useState([]);

  useEffect(async () => {
    const tokenMint = await getMintInfo(address);
  }, []);

  const getMintInfo = async (mintAddress) => {
    console.log("getting mint info " + mintAddress);

    const metadata = await programs.metadata.Metadata.load(
      connection,
      mintAddress
    );

    // console.log(metadata);
    setTokenData(metadata);
    const tokenMetadata = await getMetadata(metadata.data.data.uri);
  };

  const getMetadata = async (mintAddress) => {
    fetch(mintAddress)
      .then((response) => response.json())
      .then((data) => setTokenMetadata(data));
  };

  return (
    <div className="nft_collection">
      <div className="nft_item">
        <img src={tokenMetadata.image} alt="" className="nft_image" />
        <h3>{tokenMetadata.name}</h3>
        {/* <a
              href={`https://explorer.solana.com/address/${tokenData.data.mint}`}
              target="_blank"
              className=""
              style={{ textDecoration: "none" }}
            > </a> */}
        {/* <div className="nft_info">
              <p>Token: {tokenData.data.mint}</p>
              <div className="attributes">
                {tokenMetadata.attributes.map((attribute, i) => {
                  return (
                    <Attribute
                      trait={attribute.trait_type}
                      value={attribute.value}
                    />
                  );
                })}
              </div>
            </div> */}
      </div>
    </div>
  );
}
