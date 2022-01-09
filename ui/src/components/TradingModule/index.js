import React, { useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import sa_logo from "../../assets/images/sa_logo.png";
import me_logo from "../../assets/images/me_logo_white.png";
import smb_logo from "../../assets/images/smb_logo.png";
import ss_logo from "../../assets/images/ss_logo.png";
import sol_logo from "../../assets/images/sol_logo.png";
import { exchangeApi, explorerLink } from "../../constants/constants";

export default function TradingModule(props) {
  const { item, links } = props;

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-center justify-content-between p-2 pb-3">
      <h1 className="m-0 p-0">{item ? item.name : "Loading..."}</h1>
      <h4 className="m-0 p-0">{"Collection Name"}</h4>

      <div className="col-12 d-flex flex-column align-items-start justify-content-center p-md-2 mt-3">
        <h5 className="m-0 p-0">Status: Listed</h5>
        <h5 className="m-0 p-0">
          Price: <img src={sol_logo} alt="sol logo" className="price_logo_lg" />
          {item.price || 200}
        </h5>
      </div>

      <div className="trading_buttons d-flex flex-wrap justify-content-around col-12 mt-3">
        <div className="col-4 col-md-4 p-1 p-md-2">
          <a
            href={exchangeApi.magiceden.itemDetails + item.mint}
            target="_blank"
          >
            <button className="btn_trade">
              <div className="btn_trade_inner">
                <img
                  src={me_logo}
                  alt=""
                  style={{ height: 42, background: "transparent", margin: -8 }}
                />
              </div>
            </button>
          </a>
        </div>
        <div className="col-4 col-md-4 p-1 p-md-2">
          <a
            href={exchangeApi.solanart.itemDetails + item.mint}
            target="_blank"
          >
            <button className="btn_trade">
              <div className="btn_trade_inner">
                <img
                  src={sa_logo}
                  alt=""
                  style={{ height: 50, background: "transparent", margin: -8 }}
                />
              </div>
            </button>
          </a>
        </div>
        <div className="col-4 col-md-4 p-1 p-md-2">
          <a href={explorerLink("token", item.mint)} target="_blank">
            <button className="btn_trade">
              <div className="btn_trade_inner">
                <img
                  src={ss_logo}
                  alt=""
                  style={{ height: 50, background: "transparent", margin: -8 }}
                />
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
