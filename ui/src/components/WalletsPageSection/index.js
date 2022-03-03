import React from "react";
import Loader from "../Loader";
import WalletCard from "../WalletCard";

export default function WalletsSection(props) {
  const { buyers, sellers, volume } = props;

  return (
    <div className="d-flex flex-column align-items-center col-12 col-xxl-10">
      <div className="tablebox d-flex flex-row flex-wrap col-12 justify-content-center mb-0 pb-0">
        <h5
          className="collection_stats_days font_white mt-4 mb-4"
          style={{ fontSize: "1.8rem" }}
        >
          TOP BUYERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {buyers.length === 0 && <Loader />}
          {buyers.map((wallet, i) => {
            if (i <= 7) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
                >
                  <WalletCard data={wallet} type={"BUYS"} volume={volume} />
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* <hr style={{ color: "white", width: "50%" }} className="mt-5 mb-4" /> */}

      <div className="tablebox d-flex flex-row flex-wrap col-12 justify-content-center mt-5 mb-0 pb-0">
        <h5
          className="collection_stats_days font_white mt-4 mb-4"
          style={{ fontSize: "1.8rem" }}
        >
          TOP SELLERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {sellers.length === 0 && <Loader />}
          {sellers.map((wallet, i) => {
            if (i <= 7) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
                >
                  <WalletCard data={wallet} type={"SALES"} volume={volume} />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
