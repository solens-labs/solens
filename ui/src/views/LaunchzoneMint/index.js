import React, { useState, useEffect } from "react";
import "./style.css";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { mintToken } from "../../utils/mintToken";
import { launch_collections } from "../../constants/launchzone";
import { Helmet } from "react-helmet";
import SocialLinks from "../../components/SocialLinks";
import Loader from "../../components/Loader";
import MintingStat from "../../components/StatMinting";
import { ProgressBar } from "react-bootstrap";
import { themeColors } from "../../constants/constants";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function LaunchzoneMint(props) {
  const { symbol } = useParams();
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
    <div className="collection_launch d-flex flex-column align-items-center col-12 mt-4 mt-lg-5">
      {collectionInfo?.name && (
        <Helmet>
          <title>{`Solens - ${collectionInfo.name} Launch`}</title>
          <meta
            name="description"
            content={`Trade and get analytics for ${collectionInfo?.name} on Solana's premier NFT Marketplex.`}
          />
        </Helmet>
      )}
      {noCollection && <Redirect to="/" />}
      <div className="collection_details d-flex flex-wrap col-12 col-lg-10 col-xxl-8 mb-3">
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
        <div className="collection_header col-12 col-lg-7 d-flex flex-column align-items-center justify-content-around">
          <div>
            {collectionInfo?.name ? (
              <h1 className="collection_name_large">{collectionInfo?.name}</h1>
            ) : (
              <Loader />
            )}

            {collectionLinks && <SocialLinks links={collectionLinks} />}
          </div>

          <div className="minting_stats d-flex flex-wrap justify-content-around col-12 mt-4 mb-4">
            <MintingStat
              stat={launchDate?.toLocaleDateString()}
              label={"Launch"}
            />
            <MintingStat stat={collectionInfo?.supply} label={"Items"} />
            <MintingStat stat={collectionInfo?.price} label={"Price"} />
          </div>
          <p className="collection_description">
            {collectionInfo?.description}
          </p>
        </div>
      </div>

      <div className="minting_module chartbox d-flex flex-column align-items-center justify-content-center flex-wrap col-12 col-lg-10 col-xxl-8 mb-3 mb-lg-5">
        <h2>Minting Progress</h2>
        <div className="col-6 mt-3 mb-3">
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
          <span style={{ color: themeColors[0] }}>{`(${mintProgress}%)`}</span>
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
  );
}
