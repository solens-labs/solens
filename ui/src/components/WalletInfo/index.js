import React from "react";
import { shortenAddress } from "../../candy-machine";
import "./style.css";

export default function Walletinfo(props) {
  const { address, balance, nfts } = props;

  return (
    <div className="col-12 col-xxl-10 d-flex flex-row flex-wrap justify-content-around">
      <div className="stat_container col-12 col-lg-4 p-2">
        <div className="stat p-2">
          <h2>{shortenAddress(address)}</h2>
          <h4>Address</h4>
        </div>
      </div>
      <div className="stat_container col-12 col-lg-4 p-2">
        <div className="stat p-2">
          <h2>{balance.toFixed(2)} SOL</h2>
          <h4>Balance</h4>
        </div>
      </div>
      <div className="stat_container col-12 col-lg-4 p-2">
        <div className="stat p-2">
          <h2>{nfts}</h2>
          <h4>NFTs</h4>
        </div>
      </div>
    </div>
  );
}
