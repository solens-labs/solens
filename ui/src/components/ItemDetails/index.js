import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { shortenAddress } from "../../candy-machine";
import { explorerLink, themeColors } from "../../constants/constants";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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

  const copyAddress = (address) => {
    const copy = navigator.clipboard.writeText(address);
  };

  return (
    <div className="d-flex flex-row flex-wrap col-12">
      <div className="col-12 col-lg-6">
        <h5 style={{ color: themeColors[0] }}>NFT Details</h5>
        <hr
          style={{ color: themeColors[0], width: "40%", marginTop: -10 }}
          className="mb-2"
        />
        <div className="col-12 d-flex flex-column align-items-start justify-content-between">
          <div className="d-flex">
            <h5 className="mint_info">Mint: </h5>
            {received && item.mint && !invalid && (
              <div className="p-2 pb-0 pt-0 pr-0 d-flex align-items-center">
                <a
                  href={explorerLink("token", item.mint)}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <span className="mint_info_value">
                    {received && shortenAddress(item.mint)}
                  </span>
                </a>
                <ContentCopyIcon
                  style={{
                    height: 15,
                    fill: "rgb(179, 87, 156)",
                    cursor: "pointer",
                  }}
                  onClick={() => copyAddress(item.mint)}
                />
              </div>
            )}
            {invalid && <span className="mint_info_value">Invalid Token</span>}
          </div>
          <div className="d-flex">
            <h5 className="mint_info">Token: </h5>
            {received && tokenAccount && !invalid && (
              <div className="p-2 pb-0 pt-0 pr-0 d-flex align-items-center">
                <a
                  href={explorerLink("account", tokenAccount)}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <span className="mint_info_value">
                    {received && shortenAddress(tokenAccount)}
                  </span>
                </a>
                <ContentCopyIcon
                  style={{
                    height: 15,
                    fill: "rgb(179, 87, 156)",
                    cursor: "pointer",
                  }}
                  onClick={() => copyAddress(tokenAccount)}
                />
              </div>
            )}
            {invalid && <span className="mint_info_value">Invalid Token</span>}
          </div>
          <div className="d-flex">
            <h5 className="mint_info">Owner: </h5>
            {received && owner && !invalid && (
              <div className="p-2 pb-0 pt-0 pr-0 d-flex align-items-center">
                <a
                  href={explorerLink("account", owner)}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <span className="mint_info_value">
                    {received && shortenAddress(owner)}
                  </span>
                </a>
                <ContentCopyIcon
                  style={{
                    height: 15,
                    fill: "rgb(179, 87, 156)",
                    cursor: "pointer",
                  }}
                  onClick={() => copyAddress(owner)}
                />
              </div>
            )}
            {invalid && <span className="mint_info_value">Invalid Token</span>}
          </div>
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
