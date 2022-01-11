import React from "react";
import { shortenAddress } from "../../candy-machine";
import "./style.css";

export default function Walletinfo(props) {
  const { address, balance, nfts } = props;

  return (
    <div className="stats_container col-12 col-xl-8">
      <div className="stat">
        <h2>{shortenAddress(address)}</h2>
        <h4>Address</h4>
      </div>
      <div className="stat">
        <h2>{balance.toFixed(2)} SOL</h2>
        <h4>Balance</h4>
      </div>
      <div className="stat">
        <h2>{nfts}</h2>
        <h4>NFTs</h4>
      </div>
    </div>
  );
}
