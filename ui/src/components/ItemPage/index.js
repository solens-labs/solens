import React from "react";
import "./style.css";
import test_nft from "../../assets/images/test_nft.png";
import TradingModule from "../TradingModule";

export default function ItemPage(props) {
  return (
    <div className="col-12 d-flex flex-column align-items-center">
      <div className="d-flex flex-row col-8">
        <div className="col-6">
          <img src={test_nft} className="nft_image" alt="" />
        </div>
        <div className="col-6">
          <TradingModule />
        </div>
      </div>
    </div>
  );
}
