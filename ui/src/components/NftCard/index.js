import React from "react";
import "./style.css";
import sa_logo from "../../assets/images/sa_logo.png";
import me_logo from "../../assets/images/me_logo_white.png";
import smb_logo from "../../assets/images/smb_logo.png";
import { explorerLink } from "../../constants/constants";
import ExploreIcon from "@mui/icons-material/Explore";

export default function NftCard(props) {
  const { links, item } = props;

  return (
    <div className="nft_card_container col-12">
      {/* <a
        href={explorerLink("token", item.mint)}
        style={{ textDecoration: "none", color: "white" }}
        target="_blank"
      > */}
      <div className="nft_card col-12 d-flex flex-column align-items-center">
        <img src={item.image} className="nft_card_image" alt="nft_card" />

        <div className="nft_card_details col-12 d-flex align-items-center justify-content-between p-2 pb-0 pt-1">
          <div className="item_name col-6 pt-2 d-flex flex-wrap justify-content-start">
            <h5>{item.name}</h5>
          </div>

          <div className="mp_logos col-6 d-flex justify-content-end align-items-center">
            {links.smb && (
              <a
                href={links.smb}
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

            {links.solanart && (
              <a
                href={links.solanart}
                style={{ textDecoration: "none", color: "white" }}
                target="_blank"
              >
                <img
                  src={sa_logo}
                  className=""
                  style={{ height: 33, width: "auto" }}
                  alt=""
                />
              </a>
            )}

            {links.magiceden && (
              <a
                href={links.magiceden}
                style={{ textDecoration: "none", color: "white" }}
                target="_blank"
              >
                <img
                  src={me_logo}
                  className=""
                  style={{ height: 26, width: "auto" }}
                  alt=""
                />
              </a>
            )}

            <a
              href={explorerLink("token", item.mint)}
              style={{ textDecoration: "none", color: "white" }}
              target="_blank"
            >
              <ExploreIcon
                style={{ fill: "white", fontSize: 25, marginLeft: 7 }}
              />
            </a>
          </div>
        </div>
      </div>
      {/* </a> */}
    </div>
  );
}
