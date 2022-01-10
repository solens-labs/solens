import React from "react";
import { shortenAddress } from "../../candy-machine";
import { explorerLink } from "../../constants/constants";

export default function ItemDetails(props) {
  const { item, royalty, received } = props;

  return (
    <div className="d-flex flex-row flex-wrap col-12">
      <div className="col-12 col-lg-6 d-flex flex-column align-items-start justify-content-between">
        <h5 className="mint_info">
          Mint:{" "}
          {received && (
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
        </h5>
        <h5 className="mint_info">
          Token:{" "}
          {received && (
            <a
              href={explorerLink("token", item.mint)}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <span className="mint_info_value">
                {item && shortenAddress(item.mint)}
              </span>{" "}
            </a>
          )}
        </h5>
        <h5 className="mint_info">
          Owner:{" "}
          {received && (
            <a
              href={explorerLink("token", item.mint)}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <span className="mint_info_value">
                {received && shortenAddress(item.mint)}
              </span>{" "}
            </a>
          )}
        </h5>
      </div>

      <div className="col-12 col-lg-6 d-flex flex-column align-items-start justify-content-between">
        <h5 className="mint_info">
          Royalty:{" "}
          <span className="mint_info_value">{royalty.toFixed(2)}%</span>
        </h5>
        <h5 className="mint_info">
          Solanart Fee: <span className="mint_info_value">3%</span>
        </h5>
        <h5 className="mint_info">
          Magic Eden Fee: <span className="mint_info_value">2%</span>
        </h5>
      </div>
    </div>
  );
}
