import React from "react";
import Loader from "../Loader";
import WalletCard from "../WalletCard";

export default function WalletsHomeSection(props) {
  const { buyers, sellers, volume } = props;

  return (
    <div className="d-flex flex-row flex-wrap justify-content-center col-12">
      <div className="d-flex flex-column align-items-center col-12 col-xl-6">
        <h5
          className="collection_stats_days font_white mt-2 mb-3"
          style={{ fontSize: "1.5rem" }}
        >
          TOP BUYERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {buyers.length === 0 && <Loader />}
          {buyers.map((wallet, i) => {
            if (i <= 1) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 d-flex flex-wrap justify-content-center"
                >
                  <WalletCard data={wallet} type="BUYS" volume={volume} />
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="d-flex flex-column align-items-center col-12 col-xl-6">
        <h5
          className="collection_stats_days font_white mt-2 mb-3"
          style={{ fontSize: "1.5rem" }}
        >
          TOP SELLERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {sellers.length === 0 && <Loader />}

          {sellers.map((wallet, i) => {
            if (i <= 1) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 d-flex flex-wrap justify-content-center"
                >
                  <WalletCard data={wallet} type="SALES" volume={volume} />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
