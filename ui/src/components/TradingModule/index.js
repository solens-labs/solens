import React, { useState } from "react";
import "./style.css";
import "../Buttons/style.css";

export default function TradingModule(props) {
  const price = "2.33 SOL";

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-start">
      <div className="d-flex justify-content-around align-items-end col-12">
        <button
          className="btn-button btn-main btn-large"
          style={{ width: "80%" }}
          onClick={() => {
            console.log("trading on magic eden ");
          }}
        >
          Magic Eden
        </button>
        <button
          className="btn-button btn-main btn-large"
          style={{ width: "80%" }}
          onClick={() => {
            console.log("trading on solanart ");
          }}
        >
          Solanart
        </button>
        <button
          className="btn-button btn-main btn-large"
          style={{ width: "80%" }}
          onClick={() => {
            console.log("viewing on explorer ");
          }}
        >
          Explorer
        </button>
      </div>
    </div>
  );
}
