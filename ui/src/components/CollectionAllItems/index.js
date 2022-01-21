import React from "react";
import NftCard from "../CardNft/userWallet";

export default function CollectionAllItems(props) {
  const { collectionItems } = props;

  return (
    <>
      <h1 className="mt-0 mt-xxl-3">
        {collectionItems?.length || "Loading"} Total Items
      </h1>

      <div className="col-12 col-xxl-10 d-flex flex-row flex-wrap justify-content-center mt-4">
        {collectionItems?.length > 0 &&
          collectionItems.map((item, i) => {
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
