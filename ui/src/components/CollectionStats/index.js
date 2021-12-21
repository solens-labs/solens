import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

export default function CollectionStats(props) {
  const { collection, stats } = props;

  // const [average, setAverage] = useState(0);
  // const [minPrice, setMinPrice] = useState(0);
  // const [maxPrice, setMaxPrice] = useState(0);
  // const [volume, setVolume] = useState(0);
  // const [transactions, setTransactions] = useState(0);

  // useEffect(() => {
  //   if (stats) {
  //     // console.log(stats);
  //     let volumeCounter = 0;
  //     let txCounter = 0;

  //     stats.map((day) => {
  //       volumeCounter += day.volume;
  //       txCounter += day.saleCount;
  //     });
  //     setVolume(volumeCounter.toFixed(2));
  //     setTransactions(txCounter);
  //   }
  // }, [stats]);

  // useEffect(() => {
  //   if (volume && transactions) {
  //     setAverage((volume / transactions).toFixed(2));
  //   }
  // }, [volume, transactions]);

  return (
    <div className="collection_header">
      <div className="col-12 d-flex justify-content-center">
        <div className="col-2">
          <img
            src={collection.image}
            className="collection_image"
            alt="collection_image"
          />
        </div>

        <div className="collection_summary col-6">
          <h1 className="collection_name">{collection.name || "Loading..."}</h1>
          <p className="collection_description">
            {collection.description || "Loading..."}
          </p>

          <div className="collection_stats d-flex justify-content-around col-10">
            <div className="collection_stat">
              <h1 className="collection_info">{collection.volume} SOL</h1>
              <h1 className="collection_info_header">Volume</h1>
            </div>
            <div className="collection_stat">
              <h1 className="collection_info">{collection.transactions}</h1>
              <h1 className="collection_info_header">Transactions</h1>
            </div>
            <div className="collection_stat">
              <h1 className="collection_info">{collection.average} SOL</h1>
              <h1 className="collection_info_header">Average</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
