import React from "react";
import NftCard from "../CardNft/userprofile";

export default function UserWalletItems(props) {
  const { walletItems } = props;

  return (
    <>
      <div className="stat_container col-12 col-lg-3 p-2">
        <div className="stat p-2">
          <h2>{walletItems?.length || 0} Unlisted Items</h2>
        </div>
      </div>

      <div className="col-12 col-xxl-10 d-flex flex-row flex-wrap justify-content-center mt-4">
        {walletItems?.length > 0 &&
          walletItems.map((item, i) => {
            return (
              <div
                className="nft_grid_card col-12 col-sm-8 col-md-6 col-xl-4 col-xxl-3 p-2 p-lg-3"
                key={i}
              >
                <NftCard item={item} links={""} />
              </div>
            );
          })}
      </div>
    </>
  );
}
