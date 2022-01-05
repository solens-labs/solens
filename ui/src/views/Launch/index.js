import React, { useEffect } from "react";
import "./style.css";
import { useDispatch } from "react-redux";
import launchzone from "../../assets/images/launchzone.png";
import solana from "../../assets/images/solana.svg";
import FAQ from "../../components/FAQ";
import { links } from "../../constants/constants";

export default function Launch() {
  const dispatch = useDispatch();

  return (
    <div className="col-12 d-flex flex-column align-items-center overflow-hidden mb-5">
      <div className="launchzone_image_bg col-12 d-flex justify-content-center align-items-center">
        <div className="col-12 d-flex flex-column align-items-center">
          <img
            src={launchzone}
            alt="launchzone_logo"
            className="img-fluid"
            style={{ maxHeight: "150px", margin: 0, padding: 0 }}
          />

          {/* <hr style={{ color: "white", width: "50%" }} className="mb-3" /> */}

          <div className="blackground col-11 col-md-9 col-xxl-6 mt-4 mb-5">
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
            <button
              className="apply_launchzone explore_all_button mt-2 mb-2"
              style={{
                border: "1px solid black",
                color: "white",
              }}
            >
              Initiate Launch
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 d-flex flex-wrap justify-content-center mt-4 p-lg-5 pb-lg-0 pt-lg-0">
        <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
          <div className="launch_detail_box d-flex flex-column align-items-center">
            <h2 className="mb-1" style={{ fontWeight: "bold" }}>
              Experts
            </h2>
            <hr style={{ color: "white", width: "70%" }} className="mt-0" />
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
              Analytics
            </h2>
            <hr style={{ color: "white", width: "70%" }} className="mt-0" />
            <h5>
              Solens will provide analytics for your community as soon as
              minting completes. We make data easy-to-read and actionable.
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

      <a href={links.getListed} target="_blank">
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
