import React from "react";
import { useSelector } from "react-redux";
import { selectBalance } from "../../redux/app";

export default function TradePurchase(props) {
  const { price } = props;
  const userBalance = useSelector(selectBalance);

  const buyNft = () => {
    if (!price) {
      alert("Error fetching item price.");
    }

    if (userBalance > price) {
      alert(`Bought for ${price} SOL`);
    } else {
      alert(
        `Insufficient Funds. The item costs ${price} SOL and your current balance is ${userBalance} SOL.`
      );
    }
  };

  return (
    <>
      <div className="col-8 col-lg-4 p-1">
        <button className="btn_mp" onClick={buyNft}>
          <div className="btn_mp_inner">Buy Item</div>
        </button>
      </div>
    </>
  );
}
