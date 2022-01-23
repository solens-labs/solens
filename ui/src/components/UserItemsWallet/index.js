import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTokenMetadata } from "../../utils/getMetadata";
import NftCard from "../CardNft/itemUnlisted";
import Loader from "../Loader";

export default function UserWalletItems(props) {
  const { walletItems, walletItemsMetadata, setWalletItemsMetadata } = props;

  // const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end

  // Fetch & Set initial items
  useEffect(() => {
    if (walletItemsMetadata.length === 0 && walletItems.length > 0) {
      fetchItems(walletItemsMetadata, walletItems);
    }
  }, [walletItems]);

  // Infinite Scroll Data Fetch
  const fetchItems = async (items, walletItems) => {
    if (items.length > 0 && items.length === walletItems.length) {
      setHasMore(false);
      return;
    }

    const itemsMetadata = await fetchItemsMetadata(items, walletItems);
    setWalletItemsMetadata(itemsMetadata);
  };

  // Get metadata of an array of items
  const fetchItemsMetadata = async (items, totalItems) => {
    const newMints = totalItems.slice(items.length, items.length + 20);
    const newMetadata = newMints.map(async (item, i) => {
      const promise = await getTokenMetadata(item?.mint);
      const tokenMD = await Promise.resolve(promise);
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
          <h2>{walletItems?.length || 0} Unlisted Items</h2>
        </div>
      </div>

      <div className="col-12 col-lg-10">
        <InfiniteScroll
          dataLength={walletItemsMetadata.length}
          next={() => fetchItems(walletItemsMetadata, walletItems)}
          hasMore={hasMore}
          loader={
            <div className="mt-5 mb-5">
              <Loader />
            </div>
          }
        >
          <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
            {walletItemsMetadata.length > 0 &&
              walletItemsMetadata.map((item, i) => {
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
