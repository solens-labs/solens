import React, { useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import { connect_button, buy_button, sell_button } from "../Buttons/index";

export default function TradingModule(props) {
  const price = "2.33 SOL";
  const [connected, setConnected] = useState(false);

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-start">
      <h1>{price}</h1>
      <div className="d-flex justify-content-around align-items-end col-12 connect_button">
        {!connected && (
          <button
            className="btn-button btn-main btn-large"
            style={{ width: "80%" }}
            onClick={() => {
              setConnected(!connected);
            }}
          >
            Connect Wallet
          </button>
        )}
        {connected && buy_button}
        {connected && sell_button}
      </div>
    </div>
  );
}
