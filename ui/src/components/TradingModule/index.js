import React, { useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import sa_logo from "../../assets/images/sa_logo.png";
import me_logo from "../../assets/images/me_logo_white.png";
import smb_logo from "../../assets/images/smb_logo.png";
import ss_logo from "../../assets/images/ss_logo.png";
import sol_logo from "../../assets/images/sol_logo.png";
import { exchangeApi, explorerLink } from "../../constants/constants";
import { useHistory } from "react-router-dom";

export default function TradingModule(props) {
  const { item, mint, collection, marketplaces } = props;
  const history = useHistory();

  const collectionInsights = () => {
    history.push(`/collection/${collection.symbol}`);
    return;
  };

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-center justify-content-between p-2 pb-3">
      <h1 className="item_title m-0 p-0">{item ? item.name : "Loading..."}</h1>
      <h4 className="item_collection m-0 p-0" onClick={collectionInsights}>
        {collection?.name}
      </h4>

      {/* <div className="col-12 d-flex flex-column align-items-center justify-content-center p-md-2 mt-3">
        <h4 className="m-0 p-0">Status: Listed</h4>
        <h4 className="m-0 p-0">
          Price: <img src={sol_logo} alt="sol logo" className="price_logo_lg" />
          {item.price || 200}
        </h4>
      </div> */}

      <div className="trading_buttons d-flex flex-wrap justify-content-around col-12 mt-3">
        {marketplaces.map((mp, i) => {
          return (
            <div className="col col-md-4 p-1 p-md-2">
              <a href={exchangeApi[mp].itemDetails + item.mint} target="_blank">
                <button className="btn_trade">
                  <div className="btn_trade_inner">
                    <img
                      src={
                        mp === "magiceden"
                          ? me_logo
                          : mp === "solanart"
                          ? sa_logo
                          : mp === "smb"
                          ? smb_logo
                          : ""
                      }
                      alt=""
                      style={{
                        height: 45,
                        background: "transparent",
                        margin: -8,
                      }}
                    />
                  </div>
                </button>
              </a>
            </div>
          );
        })}
        <div className="col col-md-4 p-1 p-md-2">
          <a href={explorerLink("token", mint)} target="_blank">
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
