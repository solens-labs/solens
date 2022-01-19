import React from "react";
import NftCard from "../CardNft/userListed";

export default function UserListedItems(props) {
  const { listedItems } = props;

  return (
    <>
      <div className="stat_container col-12 col-lg-3 p-2">
        <div className="stat p-2">
          <h2>{listedItems?.length || 0} Listed Items</h2>
        </div>
      </div>

      <div className="col-12 col-xxl-10 d-flex flex-row flex-wrap justify-content-center mt-4">
        {listedItems?.length > 0 &&
          listedItems.map((item, i) => {
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
