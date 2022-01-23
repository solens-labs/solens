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

  const name = item?.name;
  const price = parseFloat(item?.list_price?.toFixed(2));
  const listedMP = item?.list_mp || item.marketplace;

  const smallWindow = window.innerWidth < 2000;
  let nameShort = name;

  if (smallWindow && name.length > 20) {
    nameShort =
      name.slice(0, 15) + " ... " + name.slice(name.length - 4, name.length);
  }

  return (
    <>
      <img
        src={item?.image}
        loading="lazy"
        className="nft_card_image"
        alt="nft_card"
      />

      <div className="nft_card_details col-12 d-flex flex-column align-items-start p-2 pb-1 pt-2 ">
        <div className="col-12 d-flex flex-column justify-content-start align-items-center">
          <h5>{nameShort}</h5>
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
              // <a
              //   href={links?.solanart}
              //   style={{
              //     textDecoration: "none",
              //     color: "white",
              //   }}
              //   target="_blank"
              // >
              <img
                src={sa_logo}
                className=""
                style={{
                  height: 33,
                  width: "auto",
                  marginLeft: -2,
                }}
                alt=""
              />
              // </a>
            )}

            {listedMP === "magiceden" && (
              // <a
              //   href={links?.magiceden}
              //   style={{
              //     textDecoration: "none",
              //     color: "white",
              //   }}
              //   target="_blank"
              // >
              <img
                src={me_logo}
                className=""
                style={{ height: 33, width: "auto" }}
                alt=""
              />
              // </a>
            )}
          </div>

          <h5 className="nft_list_price">
            {price && price + " SOL"}
            {/* <img
                src={sol_logo}
                alt="sol logo"
                className="price_logo_lg"
                style={{ marginLeft: 10 }}
              /> */}
          </h5>
        </div>
      </div>
    </>
  );
}
