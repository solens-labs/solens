import React, { useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import sa_logo from "../../assets/images/sa_logo_dark.png";
import me_logo from "../../assets/images/me_logo_white.png";
import smb_logo from "../../assets/images/smb_logo.png";
import ss_logo from "../../assets/images/ss_logo.png";
import sol_logo from "../../assets/images/sol_logo.png";
import { exchangeApi, explorerLink } from "../../constants/constants";
import { useHistory } from "react-router-dom";

export default function TradingModule(props) {
  const { invalid, invalidCollection, item, mint, collection, marketplaces } =
    props;
  const history = useHistory();

  const [selectedMarketplace, setSelectedMarketplace] = useState("");

  const collectionInsights = () => {
    history.push(`/collection/${collection.symbol}`);
    return;
  };

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-center justify-content-between p-2 pb-3">
      <h1 className="item_title m-0 p-0">
        {invalid ? "Invalid Token" : item.name}
      </h1>
      <h4 className="item_collection m-0 p-0" onClick={collectionInsights}>
        {collection?.name} {invalid && "Please check the address"}{" "}
        {invalidCollection && "Unsupported Collection"}
      </h4>

      {/* <div className="col-12 d-flex flex-column align-items-center justify-content-center p-md-2 mt-3">
        <h4 className="m-0 p-0">Status: Listed</h4>
        <h4 className="m-0 p-0">
          Price: <img src={sol_logo} alt="sol logo" className="price_logo_lg" />
          {item.price || 200}
        </h4>
      </div> */}

      <div className="trading_buttons d-flex flex-wrap justify-content-around col-12 mt-3">
        {!invalid && (
          <div className="col col-md-4 p-1 p-md-2">
            <button className="btn_mp">
              <div
                className={
                  selectedMarketplace === "magiceden"
                    ? "btn_mp_inner_selected"
                    : "btn_mp_inner"
                }
                onClick={() => setSelectedMarketplace("magiceden")}
              >
                <img
                  src={me_logo}
                  alt=""
                  style={{
                    height: 45,
                    background: "transparent",
                    margin: -8,
                  }}
                />
              </div>
            </button>
          </div>
        )}
        {!invalid && (
          <div className="col col-md-4 p-1 p-md-2">
            <button className="btn_mp">
              <div
                className={
                  selectedMarketplace === "solanart"
                    ? "btn_mp_inner_selected"
                    : "btn_mp_inner"
                }
                onClick={() => setSelectedMarketplace("solanart")}
              >
                <img
                  src={sa_logo}
                  alt=""
                  style={{
                    height: 45,
                    background: "transparent",
                    margin: -8,
                  }}
                />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
