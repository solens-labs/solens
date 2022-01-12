import React from "react";
import "./style.css";
import sa_logo from "../../assets/images/sa_logo_dark.png";
import me_logo from "../../assets/images/me_logo_white.png";
import smb_logo from "../../assets/images/smb_logo.png";
import ss_logo from "../../assets/images/ss_logo.png";
import sol_logo from "../../assets/images/sol_logo.png";
import { explorerLink } from "../../constants/constants";
import { useHistory } from "react-router-dom";
import { shortenAddress } from "../../candy-machine";

export default function NftCard(props) {
  const { links, item } = props;

  const price = parseFloat(item?.list_price.toFixed(2));
  const listedMP = item?.list_mp;

  const history = useHistory();

  // Generate link to go to internal NFT Detail Page
  const goToNFTDetailPage = (mint) => {
    history.push("/mint/" + mint);
  };

  return (
    <div className="nft_card_container col-12">
      <div className="nft_card col-12 d-flex flex-column align-items-center">
        <img
          src={item?.image}
          className="nft_card_image"
          alt="nft_card"
          onClick={() => goToNFTDetailPage(item?.mint)}
        />

        <div className="nft_card_details col-12 d-flex flex-column align-items-start p-2 pb-1 pt-1 ">
          <div className="col-12 d-flex flex-column justify-content-start align-items-center">
            <h5>{item?.name}</h5>
          </div>
          <div className="col-12 d-flex flex-row justify-content-between align-items-center">
            <div>
              {listedMP === "smb" && (
                <a
                  href={links?.smb}
                  style={{ textDecoration: "none", color: "white" }}
                  target="_blank"
                >
                  <img
                    src={smb_logo}
                    className=""
                    style={{ height: 33, width: "auto" }}
                    alt=""
                  />
                </a>
              )}

              {listedMP === "solanart" && (
                <a
                  href={links?.solanart}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: -12,
                  }}
                  target="_blank"
                >
                  <img
                    src={sa_logo}
                    className=""
                    style={{
                      height: 33,
                      width: "auto",
                    }}
                    alt=""
                  />
                </a>
              )}

              {listedMP === "magiceden" && (
                <a
                  href={links?.magiceden}
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                  target="_blank"
                >
                  <img
                    src={me_logo}
                    className=""
                    style={{ height: 33, marginRight: -2, width: "auto" }}
                    alt=""
                  />
                </a>
              )}
            </div>

            <h5 className="nft_list_price">
              {price} SOL
              {/* <img
                src={sol_logo}
                alt="sol logo"
                className="price_logo_lg"
                style={{ marginLeft: 10 }}
              /> */}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
