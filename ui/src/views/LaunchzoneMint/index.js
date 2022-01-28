import React, { useState, useEffect } from "react";
import "./style.css";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { mintToken } from "../../utils/mintToken";
import { launch_collections } from "../../constants/launchzone";
import { Helmet } from "react-helmet";
import SocialLinks from "../../components/SocialLinks";
import Loader from "../../components/Loader";

export default function LaunchzoneMint(props) {
  const { symbol } = useParams();
  const [collectionInfo, setCollectionInfo] = useState({});
  const [collectionLinks, setCollectionLinks] = useState({});
  const [noCollection, setNoCollection] = useState(false);

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
      {collectionInfo && collectionInfo.name && (
        <Helmet>
          <title>{`Solens - ${collectionInfo.name}`}</title>
          <meta
            name="description"
            content={`Trade and get analytics for ${collectionInfo?.name} on Solana's premier NFT Marketplex.`}
          />
        </Helmet>
      )}
      {noCollection && <Redirect to="/" />}
      <div className="collection_details d-flex flex-wrap col-12 col-lg-10 col-xxl-8 mb-3 mb-lg-5">
        <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
          {collectionInfo && collectionInfo.image ? (
            <img
              src={collectionInfo.image}
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
            {collectionInfo && collectionInfo.name ? (
              <h1 className="collection_name_large">{collectionInfo.name}</h1>
            ) : (
              <Loader />
            )}

            {collectionLinks && <SocialLinks links={collectionLinks} />}
          </div>

          <p className="collection_description">
            {collectionInfo && collectionInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
}
