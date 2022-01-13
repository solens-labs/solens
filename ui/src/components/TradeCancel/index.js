import React from "react";
import { marketplaceSelect } from "../../utils/collectionStats";
import "./style.css";

export default function TradeCancel(props) {
  const { marketplace } = props;

  const delistNft = () => {
    alert(`Item delisted from ${marketplaceSelect(marketplace)}`);
  };

  return (
    <>
      <div className="col-8 col-lg-4 p-1">
        <button className="btn_mp" onClick={delistNft}>
          <div className="btn_mp_inner">Cancel Listing</div>
        </button>
      </div>
    </>
  );
}
