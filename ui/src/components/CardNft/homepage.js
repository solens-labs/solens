import React from "react";
import "./style.css";
import sol_logo from "../../assets/images/sol_logo.png";
import { useHistory } from "react-router-dom";

export default function NftCard(props) {
  const { item } = props;
  const history = useHistory();

  // Generate link to go to internal NFT Detail Page
  const goToNFTDetailPage = (mint) => {
    history.push("/mint/" + mint);
  };

  return (
    <div className="nft_card_container d-flex justify-content-center col-12 col-sm-8 col-md-6 col-lg-5 col-xl-3 mb-4 pb-0 pt-0">
      <div
        className="nft_card col-10 d-flex flex-column align-items-center"
        onClick={() => goToNFTDetailPage(item.mint)}
      >
        <div className="nft_card_image_container">
          <img src={item.image} className="nft_card_image" alt="nft image" />
        </div>

        <div className="nft_card_details_home d-flex flex-column align-items-center justify-content-center">
          <h5>{item.name}</h5>
          <h4>
            <img
              src={sol_logo}
              alt="sol logo"
              className="price_logo_lg"
              alt="solana logo"
            />
            {item.price}
          </h4>
        </div>
      </div>
    </div>
  );
}
