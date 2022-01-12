import React, { useEffect, useState } from "react";
import "./style.css";
import wallet_pic from "../../assets/images/whale.png";
import { shortenAddress } from "../../candy-machine";
import {
  selectSolPrice,
  selectDailyVolume,
  selectWeeklyVolume,
} from "../../redux/app";
import { useSelector } from "react-redux";
import { explorerLink } from "../../constants/constants";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function WalletCard(props) {
  const { data, type, volume } = props;
  const solPrice = useSelector(selectSolPrice);
  const [marketPercent, setMarketPercent] = useState(0);

  useEffect(() => {
    if (volume > 0) {
      const percentage = ((data.volume * solPrice) / volume) * 100;
      setMarketPercent(percentage);
    }
  }, [volume]);

  return (
    <div
      className={`wallet_card ${
        type === "SALES" && "seller"
      } d-flex flex-column align-items-center justify-content-around`}
    >
      <div className="d-flex flex-row flex-wrap col-12 justify-content-center align-items-center p-lg-2 p-1 pb-0 pt-0">
        <div
          className={`col-5 wallet_image_container ${
            type === "SALES" && "seller_image_container"
          }`}
        >
          {/* <div className={`col-5  ${type === "SALES" && ""}`}> */}
          <img src={wallet_pic} alt="" className="wallet_image" />
          {/* <AccountBalanceWalletIcon sx={{ fontSize: 60 }} /> */}
        </div>

        <div className="col-7 d-flex flex-column align-items-end justify-content-center">
          <a
            href={explorerLink("account", data?.wallet)}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <h3 className="wallet_address spaced">
              {shortenAddress(data?.wallet)}
            </h3>
          </a>
          <h3 className="wallet_address">
            $
            {(data?.volume * solPrice).toLocaleString("en", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h3>
        </div>
      </div>

      <div className="col-12">
        <div className="d-flex flex-row flex-wrap col-12 justify-content-center">
          <div className="col-6">
            <h3 className="wallet_stat_large">
              {data?.volume.toLocaleString("en", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              SOL
            </h3>
            <h1 className="collection_stats_days font_white">VOLUME</h1>
          </div>
          <div className="col-6">
            <h3 className="wallet_stat_large">{marketPercent?.toFixed(2)}%</h3>
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
            <div className="wallet_stat_container col-3">
              <h3 className="wallet_stat_small">{data?.count}</h3>
              <h1 className="collection_stats_days font_white">{type}</h1>
            </div>
            <div className="wallet_stat_container col-3">
              <h3 className="wallet_stat_small">{data?.min}</h3>
              <h1 className="collection_stats_days font_white">MIN</h1>
            </div>
            <div className="wallet_stat_container col-3">
              <h3 className="wallet_stat_small">{data?.avg}</h3>
              <h1 className="collection_stats_days font_white">AVG</h1>
            </div>
            <div className="wallet_stat_container col-3">
              <h3 className="wallet_stat_small">{data?.max}</h3>
              <h1 className="collection_stats_days font_white">MAX</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
