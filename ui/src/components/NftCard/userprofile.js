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

        <div className="nft_card_details col-12 d-flex flex-column align-items-center justify-content-center p-2 pb-1 pt-1 ">
          <h5 style={{ fontSize: "1.2rem", fontWeight: 800 }}>{item?.name}</h5>
        </div>
      </div>
    </div>
  );
}
