import React, { useEffect } from "react";
import "./style.css";
import { useDispatch } from "react-redux";
import launchzone from "../../assets/images/launchzone.png";
import solana from "../../assets/images/solana.svg";
import FAQ from "../../components/FAQ";
import { links, themeColors } from "../../constants/constants";
import Experts from "@mui/icons-material/Psychology";
import Security from "@mui/icons-material/Security";
import Marketing from "@mui/icons-material/Public";
import Analytics from "@mui/icons-material/Insights";
import logo from "../../assets/images/logo2.png";
import { Helmet } from "react-helmet";
import { launch_collections } from "../../constants/launchzone";
import UpcomingCollection from "../../components/CardCollection/upcoming";
import LaunchMint from "../../components/LaunchMint";
import { Link, useHistory } from "react-router-dom";

export default function Launch() {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className="col-12 d-flex flex-column align-items-center overflow-hidden mb-5">
      <Helmet>
        <title>Solens - Launchzone</title>
        <meta
          name="description"
          content="Launch your Solana NFT collection through our launchpad, powered by Metaplex Candy Machine V2."
        />
      </Helmet>

      <div className="launchzone_image_bg col-12 d-flex justify-content-center align-items-center">
        <div className="col-12 d-flex flex-column align-items-center">
          <img
            src={launchzone}
            alt="launchzone_logo"
            className="img-fluid"
            style={{ maxHeight: "150px", margin: 0, padding: 0 }}
          />

          <div className="blackground col-12 col-sm-11 col-md-9 col-xxl-6 mt-4 mb-5">
            <h5>
              Looking to launch your own NFT collection on{" "}
              <span>
                <img
                  src={solana}
                  style={{ height: "1rem", paddingBottom: 4 }}
                />
              </span>
              ?
            </h5>

            <h3 className="mt-3">Apply for our NFT launchpad</h3>
            <a href={links.launchZone} target="_blank">
              <button
                className="apply_launchzone explore_all_button mt-2 mb-2"
                style={{
                  border: "1px solid black",
                  color: "white",
                }}
              >
                Initiate Launch
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* <div className="launchzone_featured col-12 d-flex justify-content-center mt-4">
        <LaunchMint symbol={"bucketheads"} />
      </div>
      <hr style={{ color: "white", width: "70%" }} className="m-4" /> */}

      <div className="upcoming_launches landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5 overflow-hidden">
        <h1 className="mb-2">Upcoming Launches</h1>
        <h5 className="collection_stats_days">
          on the{" "}
          <span>
            <Link
              to="/launch"
              style={{ textDecoration: "none", color: themeColors[0] }}
            >
              Solens Launchzone
            </Link>
          </span>
        </h5>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-2" />

        <div className="d-flex flex-wrap justify-content-around col-12 mb-4">
          {launch_collections.map((collection, i) => {
            return <UpcomingCollection collection={collection} key={i} />;
          })}
        </div>
      </div>

      <div className="col-12 d-flex flex-wrap justify-content-center mt-4 p-lg-5 pb-lg-0 pt-lg-0">
        <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
          <div className="launch_detail_box d-flex flex-column align-items-center">
            <h2 className="mb-1" style={{ fontWeight: "bold" }}>
              Experts
            </h2>
            <hr style={{ color: "white", width: "70%" }} className="mt-0" />
            <Experts
              style={{ fill: "white" }}
              fontSize="large"
              className="mb-3"
            />
            <h5>
              With a multitude of successful launches, our experienced developer
              team is ready to help bring your vision to life.
            </h5>
          </div>
        </div>
        <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
          <div className="launch_detail_box d-flex flex-column align-items-center">
            <h2 className="mb-1" style={{ fontWeight: "bold" }}>
              Security
            </h2>
            <hr style={{ color: "white", width: "70%" }} className="mt-0" />
            <Security
              style={{ fill: "white" }}
              fontSize="large"
              className="mb-3"
            />
            <h5>
              We use the Candy Machine V2 standard to ensure your code is
              secure, your funds are safe, and most of all - your community is
              protected!
            </h5>
          </div>
        </div>
        <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
          <div className="launch_detail_box d-flex flex-column align-items-center">
            <h2 className="mb-1" style={{ fontWeight: "bold" }}>
              Marketing
            </h2>
            <hr style={{ color: "white", width: "70%" }} className="mt-0" />
            <Marketing
              style={{ fill: "white" }}
              fontSize="large"
              className="mb-3"
            />
            <h5>
              Gain exposure for your collection by being featured in our
              Launchzone collection of the day. Solensians will get to explore
              your community!
            </h5>
          </div>
        </div>
        <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
          <div className="launch_detail_box d-flex flex-column align-items-center">
            <h2 className="mb-1" style={{ fontWeight: "bold" }}>
              Trading
            </h2>
            <hr style={{ color: "white", width: "70%" }} className="mt-0" />
            <Analytics
              style={{ fill: "white" }}
              fontSize="large"
              className="mb-3"
            />
            <h5>
              Your collection will have an analytics & trading page as soon as
              minting completes. Give your community access to multiple
              secondary markets.
            </h5>
          </div>
        </div>
        {/* <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
          <div className="launch_detail_box d-flex flex-column align-items-center">
            <h2 className="mb-1" style={{ fontWeight: "bold" }}>
              Trustless
            </h2>
            <hr style={{ color: "white", width: "70%" }} className="mt-0" />
            <h5>
              Your raised funds will be available in real-time as your mint is
              underway, sent to you via open-source payment splitters.
            </h5>
          </div>
        </div> */}
      </div>

      <FAQ />

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
