import React from "react";

export default function StatSummary(props) {
  const { title, volume, transactions, minPrice, average, maxPrice } = props;
  return (
    <>
      <h1>{title} This Week</h1>
      <div className="collection_stats d-flex flex-wrap justify-content-center col-12">
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {volume
              ? volume.toLocaleString("en", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : 0}{" "}
            SOL
          </h1>
          <h1 className="collection_info_header">Volume</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {transactions ? transactions.toLocaleString() : 0}
          </h1>

          <h1 className="collection_info_header">Transactions</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {minPrice ? minPrice.toFixed(2) : 0} SOL
          </h1>

          <h1 className="collection_info_header">Lowest</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {average ? average.toFixed(2) : 0} SOL
          </h1>

          <h1 className="collection_info_header">Average</h1>
        </div>
        <div className="collection_stat_secondary">
          <h1 className="collection_info collection_info_large">
            {maxPrice ? maxPrice.toFixed(2) : 0} SOL
          </h1>

          <h1 className="collection_info_header">Highest</h1>
        </div>
      </div>
    </>
  );
}
