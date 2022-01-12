import React from "react";
import { shortenAddress } from "../../candy-machine";
import { explorerLink } from "../../constants/constants";

export default function ItemDetails(props) {
  const {
    invalid,
    item,
    royalty,
    received,
    tokenAccount,
    ownerAccount,
    marketplaces,
  } = props;
  const solanart = marketplaces.filter((item) => item === "solanart").length;
  const magiceden = marketplaces.filter((item) => item === "magiceden").length;
  const smb = marketplaces.filter((item) => item === "smb").length;

  return (
    <div className="d-flex flex-row flex-wrap col-12">
      <div className="col-12 col-lg-6 d-flex flex-column align-items-start justify-content-between">
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
          {received && ownerAccount && !invalid && (
            <a
              href={explorerLink("account", ownerAccount)}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <span className="mint_info_value">
                {received && shortenAddress(ownerAccount)}
              </span>{" "}
            </a>
          )}
          {invalid && <span className="mint_info_value">Invalid Token</span>}
        </h5>
      </div>
      <div className="col-12 col-lg-6 d-flex flex-column align-items-start justify-content-start">
        {smb === 0 && (
          <h5 className="mint_info">
            Project Fee:{" "}
            <span className="mint_info_value">{royalty.toFixed(2)}%</span>
          </h5>
        )}
        {smb > 0 && (
          <h5 className="mint_info">
            SMB Market Fee: <span className="mint_info_value">5%</span>
          </h5>
        )}
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
      </div>
    </div>
  );
}
