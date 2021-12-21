import React from "react";

export default function StatSummary(props) {
  const { title, collectionData, transactions, minPrice, average, maxPrice } =
    props;
  return (
    <>
      <h1>{title} Summary</h1>
      <div className="collection_stats d-flex flex-wrap justify-content-around col-10 mb-5">
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {collectionData.total_volume.toLocaleString("en", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }) || "Loading..."}{" "}
            SOL
          </h1>
          <h1 className="collection_info_header">Volume</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {transactions.toLocaleString() || 0}
          </h1>

          <h1 className="collection_info_header">Transactions</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {minPrice.toFixed(2) || 0} SOL
          </h1>

          <h1 className="collection_info_header">Lowest</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {average.toFixed(2) || "Loading..."} SOL
          </h1>

          <h1 className="collection_info_header">Average</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {maxPrice.toFixed(2) || 0} SOL
          </h1>

          <h1 className="collection_info_header">Highest</h1>
        </div>
      </div>
    </>
  );
}
