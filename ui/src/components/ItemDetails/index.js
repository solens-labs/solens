import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { shortenAddress } from "../../candy-machine";
import { explorerLink, themeColors } from "../../constants/constants";

export default function ItemDetails(props) {
  const {
    invalid,
    item,
    royalty,
    received,
    listedDetails,
    tokenAccount,
    ownerAccount,
  } = props;

  const owner = listedDetails?.owner || ownerAccount;

  return (
    <div className="d-flex flex-row flex-wrap col-12">
      <div className="col-12 col-lg-6">
        <h5 style={{ color: themeColors[0] }}>NFT Details</h5>
        <hr
          style={{ color: themeColors[0], width: "40%", marginTop: -10 }}
          className="mb-2"
        />
        <div className="col-12 d-flex flex-column align-items-start justify-content-between">
          <h5 className="mint_info">
            Mint:{" "}
            {received && item.mint && !invalid && (
              <a
                href={explorerLink("token", item.mint)}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <span className="mint_info_value">
                  {received && shortenAddress(item.mint)}
                </span>
              </a>
            )}
            {invalid && <span className="mint_info_value">Invalid Token</span>}
          </h5>
          <h5 className="mint_info">
            Token:{" "}
            {received && tokenAccount && !invalid && (
              <a
                href={explorerLink("account", tokenAccount)}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <span className="mint_info_value">
                  {item && shortenAddress(tokenAccount)}
                </span>{" "}
              </a>
            )}
            {invalid && <span className="mint_info_value">Invalid Token</span>}
          </h5>
          <h5 className="mint_info">
            Owner:{" "}
            {received && owner && !invalid && (
              <a
                href={explorerLink("account", owner)}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <span className="mint_info_value">
                  {received && shortenAddress(owner)}
                </span>{" "}
              </a>
            )}
            {invalid && <span className="mint_info_value">Invalid Token</span>}
          </h5>
        </div>
      </div>

      <div className="col-12 col-lg-6 mt-4 mt-lg-0">
        <h5 style={{ color: themeColors[0] }}>Seller Fees</h5>
        <hr
          style={{ color: themeColors[0], width: "40%", marginTop: -10 }}
          className="mb-2"
        />
        <div className="col-12 d-flex flex-column align-items-start justify-content-between">
          <h5 className="mint_info">
            Project Fee:{" "}
            <span className="mint_info_value">
              {!invalid ? royalty + "%" : "Invalid Token"}
            </span>
          </h5>
          <h5 className="mint_info">
            Solanart Fee: <span className="mint_info_value">3%</span>
          </h5>
          <h5 className="mint_info">
            Magic Eden Fee: <span className="mint_info_value">2%</span>
          </h5>
        </div>
      </div>
    </div>
  );
}

/* <div className="col-12 col-lg-6 d-flex flex-column align-items-start justify-content-start">
  <h5 className="mint_info">
    Royalty:{" "}
    <span className="mint_info_value">{royalty.toFixed(2)}%</span>
  </h5>
  {solanart > 0 && (
    <h5 className="mint_info">
      Solanart Fee: <span className="mint_info_value">3%</span>
    </h5>
  )}
  {magiceden > 0 && (
    <h5 className="mint_info">
      Magic Eden Fee: <span className="mint_info_value">2%</span>
    </h5>
  )}
</div> */
