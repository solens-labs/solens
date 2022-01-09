import React, { useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import sa_logo from "../../assets/images/sa_logo.png";
import me_logo from "../../assets/images/me_logo_white.png";
import smb_logo from "../../assets/images/smb_logo.png";
import ss_logo from "../../assets/images/ss_logo.png";
import { exchangeApi, explorerLink } from "../../constants/constants";

export default function TradingModule(props) {
  const { item, links } = props;

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-center justify-content-between pt-2 pb-3">
      <h1>{item ? item.name : "Loading..."}</h1>
      <h5>item_listed_price_or_unlisted</h5>

      <div className="trading_buttons d-flex flex-wrap justify-content-around align-items-end col-12 mt-3">
        <a href={exchangeApi.magiceden.itemDetails + item.mint} target="_blank">
          <button className="btn-button btn-main">
            <img
              src={me_logo}
              alt=""
              style={{ height: 42, background: "transparent", margin: -8 }}
            />
          </button>
        </a>
        <a href={exchangeApi.solanart.itemDetails + item.mint} target="_blank">
          <button className="btn-button btn-main">
            <img
              src={sa_logo}
              alt=""
              style={{ height: 50, background: "transparent", margin: -8 }}
            />
          </button>
        </a>
        <a href={explorerLink("token", item.mint)} target="_blank">
          <button className="btn-button btn-main">
            <img
              src={ss_logo}
              alt=""
              style={{ height: 50, background: "transparent", margin: -8 }}
            />
          </button>
        </a>
      </div>
    </div>
  );
}
