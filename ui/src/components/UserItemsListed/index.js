import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTokenMetadata } from "../../utils/getMetadata";
import NftCard from "../CardNft/userListed";
import Loader from "../Loader";

export default function UserListedItems(props) {
  const { listedItems, setlistedItemsMetadata, listedItemsMetadata } = props;

  // const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end

  // Fetch & Set initial items
  useEffect(() => {
    if (listedItemsMetadata.length === 0 && listedItems.length > 0) {
      fetchItems(listedItemsMetadata, listedItems);
    }
  }, [listedItems]);

  // Infinite Scroll Data Fetch
  const fetchItems = async (items, listedItems) => {
    if (items.length > 0 && items.length === listedItems.length) {
      setHasMore(false);
      return;
    }

    const itemsMetadata = await fetchItemsMetadata(items, listedItems);
    setlistedItemsMetadata(itemsMetadata);
  };

  // Get metadata of an array of items
  const fetchItemsMetadata = async (items, totalItems) => {
    const newMints = totalItems.slice(items.length, items.length + 20);
    const newMetadata = newMints.map(async (item, i) => {
      const promise = await getTokenMetadata(item?.mint);
      const tokenMD = await Promise.resolve(promise);
      tokenMD["list_price"] = item?.price;
      tokenMD["list_mp"] = item?.marketplace;
      tokenMD["owner"] = item?.owner;
      return tokenMD;
    });
    const newResolved = await Promise.all(newMetadata);
    const fullItems = [...items, ...newResolved];
    return fullItems;
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
          next={() => fetchItems(listedItemsMetadata, listedItems)}
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
