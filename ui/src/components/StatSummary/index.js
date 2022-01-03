import React from "react";
import "./style.css";
import { marketplaceSelect } from "../../utils/collectionStats";
import ReactGA from "react-ga";

export default function StatSummary(props) {
  const { symbol, marketplaceData } = props;

  const marketplaceLink = () => {
    if (marketplaceData.marketplace === "solanart") {
      return `https://solanart.io/collections/${symbol}`;
    } else if (marketplaceData.marketplace === "magiceden") {
      return `https://magiceden.io/marketplace/${symbol}`;
    } else if (marketplaceData.marketplace === "smb") {
      return `https://market.solanamonkey.business/`;
    }
  };

  const sendAnalytics = () => {
    ReactGA.event({
      category: "Outbound",
      action: `Trade on ${marketplaceData.marketplace}`,
      label: symbol,
    });
    ReactGA.event({
      category: "Trade",
      action: `Trading ${symbol}`,
      label: marketplaceData.marketplace,
    });
  };

  return (
    <div className="col-12 col-lg-10">
      <h1>{marketplaceSelect(marketplaceData.marketplace)}</h1>
      <h5 className="collection_stats_days">
        LAST {marketplaceData.dates.length} DAYS
      </h5>
      {/* <hr style={{ color: "white", margin: "10px 0px 10px 0px" }} /> */}
      <div className="collection_stats d-flex flex-wrap justify-content-center col-12">
        <div className="collection_stat_container col-6">
          <div className="collection_stat_secondary">
            <h1 className="collection_info collection_info_large">
              {marketplaceData.volume
                ? marketplaceData.volume.toLocaleString("en", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : 0}
            </h1>
            <h1 className="collection_info_header">Volume (SOL)</h1>
          </div>
        </div>
        <div className="collection_stat_container col-6">
          <div className="collection_stat_secondary">
            <h1 className="collection_info collection_info_large">
              {marketplaceData.transactions
                ? marketplaceData.transactions.toLocaleString()
                : 0}
            </h1>

            <h1 className="collection_info_header">Transactions</h1>
          </div>
        </div>
      </div>
      <div className="collection_stat_container col-12">
        <div className="collection_stat_secondary d-flex flex-wrap justify-content-around">
          <div>
            <h1 className="collection_info collection_info_large">
              {marketplaceData.minPrice
                ? marketplaceData.minPrice.toFixed(2)
                : 0}
            </h1>

            <h1 className="collection_info_header">Lowest</h1>
          </div>
          <div>
            <h1 className="collection_info collection_info_large">
              {marketplaceData.average ? marketplaceData.average.toFixed(2) : 0}
            </h1>

            <h1 className="collection_info_header">Average</h1>
          </div>
          <div>
            <h1 className="collection_info collection_info_large">
              {marketplaceData.maxPrice
                ? marketplaceData.maxPrice.toFixed(2)
                : 0}
            </h1>

            <h1 className="collection_info_header">Highest</h1>
          </div>
        </div>
      </div>

      <a
        href={marketplaceLink()}
        target="_blank"
        style={{ textDecoration: "none", width: "100%" }}
      >
        <div
          className="col-12 btn-button btn-main btn-large btn-wide d-flex mt-2 mb-2"
          onClick={() => sendAnalytics()}
        >
          Trade
        </div>
      </a>

      {/* <a href={marketplaceLink()} target="_blank">
          <button className="btn-button btn-main btn-large">Sell</button>
        </a> */}
    </div>
  );
}
