import React from "react";
import "./style.css";
import whale_pic from "../../assets/images/whale.png";
import { shortenAddress } from "../../candy-machine";
import { selectSolPrice } from "../../redux/app";
import { useSelector } from "react-redux";

export default function WhaleCard(props) {
  const { data, type } = props;
  const solPrice = useSelector(selectSolPrice);

  return (
    <div className="whale_card d-flex flex-column align-items-center justify-content-around">
      <a
        href={`https://explorer.solana.com/address/${data.account}`}
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <div className="whale_image_container">
          <img src={whale_pic} alt="" className="whale_image" />
        </div>
        <h3 className="whale_address mt-1">{shortenAddress(data.account)}</h3>
      </a>

      <div>
        <div className="d-flex flex-row flex-wrap col-12 justify-content-between">
          <h3 className="whale_stat_large">
            $
            {(data.volume * solPrice).toLocaleString("en", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h3>
          <h3
            className="whale_stat_large m-2 mb-0 mt-0"
            style={{ fontWeight: "normal" }}
          >
            |{" "}
          </h3>
          <h3 className="whale_stat_large">
            {data.volume.toLocaleString("en", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            SOL
          </h3>
        </div>
        <h1 className="collection_stats_days font_white">VOLUME</h1>
      </div>
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
  );
}
