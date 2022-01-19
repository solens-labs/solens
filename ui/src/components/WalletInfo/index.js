import React from "react";
import { shortenAddress } from "../../candy-machine";
import { explorerLink, themeColors } from "../../constants/constants";
import "./style.css";

export default function Walletinfo(props) {
  const { address, balance, nfts = 0, listed = 0 } = props;

  return (
    <div className="col-12 col-xxl-8 d-flex flex-row flex-wrap justify-content-around">
      <div className="stat_container col-12 col-lg-3 p-2">
        <div className="stat p-2 overflow-hidden">
          <a
            href={explorerLink("account", address)}
            target="_blank"
            className="transaction"
            style={{ textDecoration: "none", color: themeColors[0] }}
          >
            <h2>{shortenAddress(address)}</h2>
          </a>
          <h4>Address</h4>
        </div>
      </div>
      <div className="stat_container col-12 col-lg-3 p-2">
        <div className="stat p-2 overflow-hidden">
          <h2>{balance.toFixed(2)} SOL</h2>
          <h4>Balance</h4>
        </div>
      </div>
      <div className="stat_container col-12 col-lg-3 p-2">
        <div className="stat p-2 overflow-hidden">
          <h2>{listed}</h2>
          <h4>{listed === 1 ? "Listed NFT" : "Listed NFTs"}</h4>
        </div>
      </div>
      <div className="stat_container col-12 col-lg-3 p-2">
        <div className="stat p-2 overflow-hidden">
          <h2>{nfts}</h2>
          <h4>{nfts === 1 ? "Wallet NFT" : "Wallet NFTs"}</h4>
        </div>
      </div>
    </div>
  );
}
