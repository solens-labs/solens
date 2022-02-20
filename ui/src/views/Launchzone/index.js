import React, { useEffect } from "react";
import "./style.css";
import { useDispatch } from "react-redux";
import FAQ from "../../components/FAQ";
import { links, themeColors } from "../../constants/constants";
import { Helmet } from "react-helmet";
import {
  launch_collections,
  minting_collections,
} from "../../constants/launchzone";
import UpcomingCollection from "../../components/CardCollection/upcoming";
import LaunchMint from "../../components/LaunchMint";
import { Link, useHistory } from "react-router-dom";
import LaunchHeaders from "../../components/LaunchHeaders";
import LaunchHero from "../../components/LaunchHero";

export default function Launch() {
  const dispatch = useDispatch();
  const history = useHistory();

  const upcoming = [];
  const minting = [];
  const previous = [];

  useEffect(() => {
    if (launch_collections.length === 0 || minting_collections.length === 0) {
      return;
    }
    const now = Date.now();
    const allCollections = [...launch_collections, ...minting_collections];

    allCollections.map((collection) => {
      const launchDate = collection.launchDate;
      const endDate = collection.endDate;
      if (launchDate > now) {
        upcoming.push(collection);
      }

      if (launchDate < now) {
        minting.push(collection);
      }

      if (endDate < now) {
        previous.push(collection);
      }
    });
  }, [launch_collections, minting_collections]);

  return (
    <div className="col-12 d-flex flex-column align-items-center overflow-hidden mb-5">
      <Helmet>
        <title>Solens - Launchzone</title>
        <meta
          name="description"
          content="Launch your Solana NFT collection through our launchpad, powered by Metaplex Candy Machine V2."
        />
      </Helmet>

      <LaunchHero />

      {/* <div className="launchzone_featured col-12 d-flex justify-content-center mt-4">
        <LaunchMint symbol={"club_crypto"} />
      </div> */}
      {/* <hr style={{ color: "white", width: "70%" }} className="m-4" /> */}

      <div className="upcoming_launches landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5 overflow-hidden">
        <h1>Launchzone Collections</h1>

        <div className="d-flex flex-wrap justify-content-around col-12 mb-4">
          {launch_collections.map((collection, i) => {
            return <UpcomingCollection collection={collection} key={i} />;
          })}
        </div>
      </div>

      {/* <LaunchHeaders /> */}
      {/* <FAQ /> */}

      <a href={links.launchZone} target="_blank">
        <button
          className="apply_launchzone explore_all_button mt-5"
          style={{
            border: "1px solid black",
            color: "white",
          }}
        >
          Apply for Launchpad
        </button>
      </a>
    </div>
  );
}
