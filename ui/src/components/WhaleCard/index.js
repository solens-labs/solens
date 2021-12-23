import React from "react";
import "./style.css";
import whale_pic from "../../assets/images/whale.png";
import { shortenAddress } from "../../candy-machine";
import { selectSolPrice, selectTotalVolume } from "../../redux/app";
import { useSelector } from "react-redux";

export default function WhaleCard(props) {
  const { data, type } = props;
  const solPrice = useSelector(selectSolPrice);
  const totalVolume = useSelector(selectTotalVolume);
  const marketPercent = ((data.volume * solPrice) / totalVolume) * 100;

  return (
    <div
      className={`whale_card ${
        type === "SALES" && "seller"
      } d-flex flex-column align-items-center justify-content-around`}
    >
      <div className="d-flex flex-row flex-wrap col-12 justify-content-around align-items-center">
        <div
          className={`whale_image_container ${
            type === "SALES" && "seller_image_container"
          }`}
        >
          <img src={whale_pic} alt="" className="whale_image" />
        </div>

        <div className="d-flex flex-column align-items-end justify-content-center">
          <a
            href={`https://explorer.solana.com/address/${data.account}`}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <h3 className="whale_address">{shortenAddress(data.account)}</h3>
          </a>
          <h3 className="whale_address">
            $
            {(data.volume * solPrice).toLocaleString("en", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h3>
          {/* <h3 className="whale_address">
            {data.volume.toLocaleString("en", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            SOL
          </h3> */}
        </div>
      </div>

      {/* 
      <a
        href={`https://explorer.solana.com/address/${data.account}`}
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <div className="d-flex flex-row flex-wrap col-12 justify-content-center align-items-center">
          <h3 className="whale_address mt-1 p-2 pb-0 pt-0">
            {shortenAddress(data.account).slice(0, 7)}
          </h3>

          <div
            className={`whale_image_container ${
              type === "SALES" && "seller_image_container"
            }`}
          >
            <img src={whale_pic} alt="" className="whale_image" />
          </div>
          <h3 className="whale_address mt-1 p-2 pb-0 pt-0">
            {shortenAddress(data.account).slice(4, 11)}
          </h3>
        </div>
      </a>
      */}

      <div className="col-12">
        <div className="d-flex flex-row flex-wrap col-12 justify-content-center">
          <div className="col-6">
            {/* <h3 className="whale_stat_large">
              $
              {(data.volume * solPrice).toLocaleString("en", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h3> */}
            <h3 className="whale_stat_large">
              {data.volume.toLocaleString("en", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              SOL
            </h3>
            <h1 className="collection_stats_days font_white">VOLUME</h1>
          </div>
          <div className="col-6">
            <h3 className="whale_stat_large">{marketPercent.toFixed(2)}%</h3>
            <h1 className="collection_stats_days font_white">Market Share</h1>
          </div>
        </div>

        <div className="col-12 d-flex flex-column mt-2">
          <hr
            style={{
              color: "black",
              width: "100%",
              border: "2px solid black",
              margin: "15px 0px",
              padding: 0,
            }}
          />
          <div className="col-12 d-flex flex-row flex-wrap justify-content-between p-2 pt-0 pb-0">
            <div className="whale_stat_container col-3">
              <h3 className="whale_stat_small">{data.count}</h3>
              <h1 className="collection_stats_days font_white">{type}</h1>
            </div>
            <div className="whale_stat_container col-3">
              <h3 className="whale_stat_small">{data.min}</h3>
              <h1 className="collection_stats_days font_white">MIN</h1>
            </div>
            <div className="whale_stat_container col-3">
              <h3 className="whale_stat_small">{data.avg}</h3>
              <h1 className="collection_stats_days font_white">AVG</h1>
            </div>
            <div className="whale_stat_container col-3">
              <h3 className="whale_stat_small">{data.max}</h3>
              <h1 className="collection_stats_days font_white">MAX</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
