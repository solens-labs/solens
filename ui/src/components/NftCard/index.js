import React from "react";
import "./style.css";

export default function NftCard(props) {
  const { link, item } = props;

  return (
    <div className="nft_card_container col-12">
      <a
        href={link}
        style={{ textDecoration: "none", color: "white" }}
        target="_blank"
      >
        <div className="nft_card d-flex flex-column align-items-center">
          <img src={item.image} className="nft_card_image" alt="nft_card" />

          <div className="nft_card_details d-flex flex-column align-items-center justify-content-center">
            <h5>{item.name}</h5>
          </div>
        </div>
      </a>
    </div>
  );
}
