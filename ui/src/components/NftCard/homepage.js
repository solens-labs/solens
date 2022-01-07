import React from "react";
import "./style.css";
import sol_logo from "../../assets/images/sol_logo.png";

export default function NftCard(props) {
  const { link, item } = props;

  return (
    <div className="nft_card_container col-12 col-sm-8 col-md-6 col-lg-5 col-xl-3 mb-4 p-2 pb-0 pt-0">
      <a href={link} style={{ textDecoration: "none", color: "white" }}>
        <div className="nft_card d-flex flex-column align-items-center">
          <img src={item.image} className="nft_card_image" alt="nft_card" />

          <div className="nft_card_details d-flex flex-column align-items-center justify-content-center">
            <h5>{item.name}</h5>
            <h4>
              <img src={sol_logo} alt="sol logo" className="price_logo_lg" />
              {item.price}
            </h4>
          </div>
        </div>
      </a>
    </div>
  );
}
