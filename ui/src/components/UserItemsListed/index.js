import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchItemsMetadata } from "../../utils/getItemsMetadata";
import { getTokenMetadata } from "../../utils/getMetadata";
import NftCard from "../CardNft/itemListed";
import Loader from "../Loader";

export default function UserListedItems(props) {
  const { listedItems, setlistedItemsMetadata, listedItemsMetadata } = props;

  const [hasMore, setHasMore] = useState(true);

  // Infinite Scroll Data Fetch
  const fetchItems = async () => {
    if (
      // listedItemsMetadata.length > 0 &&
      listedItemsMetadata.length === listedItems.length
    ) {
      setHasMore(false);
      return;
    }
    const itemsMetadata = await fetchItemsMetadata(
      listedItemsMetadata,
      listedItems
    );
    setlistedItemsMetadata(itemsMetadata);
  };

  return (
    <>
      <div className="stat_container col-12 col-lg-4 col-xxl-3 p-2">
        <div className="stat p-2">
          <h2>{listedItems?.length || 0} Listed Items</h2>
        </div>
      </div>

      <div className="col-12 col-lg-10">
        <InfiniteScroll
          dataLength={listedItemsMetadata.length}
          next={fetchItems}
          hasMore={hasMore}
          loader={
            <div className="mt-5 mb-5">
              <Loader />
            </div>
          }
        >
          <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
            {listedItemsMetadata.length > 0 &&
              listedItemsMetadata.map((item, i) => {
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
        </InfiniteScroll>
      </div>
    </>
  );
}
