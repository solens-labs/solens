import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import { themeColors } from "../../constants/constants";
import { launch_collections } from "../../constants/launchzone";
import Loader from "../Loader";
import SocialLinks from "../SocialLinks";

export default function LaunchMint(props) {
  const { symbol } = props;
  const [collectionInfo, setCollectionInfo] = useState({});
  const [collectionLinks, setCollectionLinks] = useState({});
  const [noCollection, setNoCollection] = useState(false);

  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };

  const launchDate = new Date(collectionInfo?.date);
  const endDate = new Date(collectionInfo?.date).addHours(48);
  const now = new Date();

  const [mintProgress, setMintProgress] = useState(65);
  const itemsTotal = collectionInfo?.supply;
  const itemsMinted = mintProgress * 0.01 * itemsTotal;
  const itemsRemaining = 0;

  useEffect(() => {
    const [filtered] = launch_collections.filter(
      (item) => item.symbol === symbol
    );
    if (!filtered) {
      setNoCollection(true);
      return;
    }
    setCollectionInfo(filtered);
    const links = {
      website: filtered.website,
      twitter: filtered.twitter,
      discord: filtered.discord,
    };
    setCollectionLinks(links);
  }, [symbol]);

  return (
    <div className="col-12 d-flex flex-column align-items-center">
      <h1 className="">Featured Launch</h1>
      <div className="chartbox collection_details d-flex flex-wrap justify-content-center col-12 col-lg-10 col-xxl-8 mt-3 mb-3">
        <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
          {collectionInfo?.image ? (
            <img
              src={collectionInfo?.image}
              alt="collection_image"
              className="collection_image_large img-fluid"
            />
          ) : (
            <div className="collection_image_large d-flex justify-content-center overflow-hidden">
              <Loader />
            </div>
          )}
        </div>

        <div className="minting_module  d-flex flex-column align-items-center justify-content-center flex-wrap col-12 col-lg-7 mt-3 mt-lg-0 mb-3 mb-lg-5">
          {/* <h2>Minting Progress</h2> */}

          <div>
            {collectionInfo?.name ? (
              <h1 className="collection_name_large">{collectionInfo?.name}</h1>
            ) : (
              <Loader />
            )}

            {collectionLinks && <SocialLinks links={collectionLinks} />}
          </div>

          <div className="col-12 col-lg-6 mt-4 mb-3">
            <ProgressBar
              style={{
                backgroundColor: "rgb(25, 16, 51)",
                border: "1px solid rgba(255,255,255,0.2)",
                // height: 30,
              }}
              animated
              striped={true}
              now={mintProgress}
              // label={`${mintProgress}%`}
            />
          </div>
          <h4 className="mb-4">
            Items Minted: {itemsMinted?.toLocaleString()} /{" "}
            {itemsTotal?.toLocaleString()}{" "}
            <span
              style={{ color: themeColors[0] }}
            >{`(${mintProgress}%)`}</span>
          </h4>

          <WalletMultiButton
            className="connect_button"
            style={{
              border: "1px solid black",
              color: "white",
              borderRadius: 15,
            }}
          />
        </div>
      </div>
    </div>
  );
}
