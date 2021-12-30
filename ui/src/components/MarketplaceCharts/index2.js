import React from "react";
import "./style.css";
import StatSummary from "../StatSummary";
import LineChart from "../LineChart";
import { lineColors } from "../../constants/constants";
import { marketplaceSelect } from "../../utils/collectionStats";

export default function MarketplaceCharts(props) {
  const { marketplaceData, symbol } = props;
  // console.log(marketplaceData);

  return (
    <>
      {marketplaceData.floorsArray && (
        <div className="chartbox d-flex justify-content-center col-12 col-lg-5 mt-lg-0 mb-5">
          <StatSummary marketplaceData={marketplaceData} symbol={symbol} />
        </div>
      )}
      <div className="d-flex flex-row flex-wrap justify-content-around col-12 col-lg-10">
        {!marketplaceData.floorsArray && (
          <div className="chartbox d-flex justify-content-center col-12 col-lg-5 mt-lg-0 mb-5">
            <StatSummary marketplaceData={marketplaceData} symbol={symbol} />
          </div>
        )}
        <div className="chartbox d-flex justify-content-center col-12 col-lg-5 mt-5 mt-lg-0">
          <LineChart
            chartTitle={`${marketplaceSelect(
              marketplaceData.marketplace
            )} Price`}
            dates={marketplaceData.dates}
            legend={["Max Price", "Avg Price", "Min Price"]}
            dataset={[
              marketplaceData.maxArray,
              marketplaceData.averageArray,
              marketplaceData.minArray,
              // marketplaceData.floorsArray,
            ]}
          />
        </div>
        {marketplaceData.floorsArray && (
          <div className="chartbox d-flex justify-content-center col-12 col-lg-5 mt-lg-0">
            <LineChart
              chartTitle={`${marketplaceSelect(
                marketplaceData.marketplace
              )} Floor`}
              dates={marketplaceData.floorDates}
              legend={["Floor (SOL)"]}
              dataset={[marketplaceData.floorsArray]}
              color={lineColors[2]}
            />
          </div>
        )}
      </div>
      <div className="d-flex flex-row flex-wrap justify-content-around col-12 col-lg-10 mt-lg-5">
        <div className="chartbox d-flex justify-content-center col-12 col-lg-5 mt-5 mt-lg-0">
          <LineChart
            chartTitle={`${marketplaceSelect(
              marketplaceData.marketplace
            )} Volume`}
            dates={marketplaceData.dates}
            legend={["Volume (SOL)"]}
            dataset={[marketplaceData.volumeArray]}
            color={lineColors[0]}
          />
        </div>
        <div className="chartbox d-flex justify-content-center col-12 col-lg-5 mt-5 mt-lg-0">
          <LineChart
            chartTitle={`${marketplaceSelect(
              marketplaceData.marketplace
            )} Transactions`}
            dates={marketplaceData.dates}
            legend={["Transactions (Count)"]}
            dataset={[marketplaceData.transactionsArray]}
            color={lineColors[1]}
          />
        </div>
      </div>
      <hr style={{ color: "white", width: "50%" }} className="mt-5 mb-5" />
    </>
  );
}
