import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { fetchItemsMetadata } from "../../utils/getItemsMetadata";
import { getTokenMetadata } from "../../utils/getMetadata";
import NftCard from "../CardNft/itemUnlisted";
import Loader from "../Loader";

export default function CollectionAllItems(props) {
  const { allItems, name } = props;

  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end

  // Fetch & Set initial items
  useEffect(() => {
    if (items.length === 0 && allItems.length > 0) {
      fetchItems(items, allItems);
    }
  }, [allItems]);

  // Infinite Scroll Data Fetch
  const fetchItems = async (items, allItems) => {
    if (items.length > 0 && items.length === allItems.length) {
      setHasMore(false);
      return;
    }

    const itemsMetadata = await fetchItemsMetadata(items, allItems);
    setItems(itemsMetadata);
  };

  return (
    <>
      <div className="col-12 p-2">
        <h1 className="">{allItems?.length || "Loading"} Total Items</h1>
      </div>

      <div className="col-12 col-lg-10">
        <InfiniteScroll
          dataLength={items.length}
          next={() => fetchItems(items, allItems)}
          hasMore={hasMore}
          loader={
            <div className="mt-5 mb-5">
              <Loader />
            </div>
          }
        >
          <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
            {items.length > 0 &&
              items.map((item, i) => {
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

      {items.length > 0 && hasMore && (
        <div
          className="col-12 btn-button btn-main btn-large d-flex mt-3 mt-lg-5 mb-2"
          onClick={() => fetchItems(items, allItems)}
        >
          Load More
        </div>
      )}

      {!hasMore && (
        <Link to={`/collection/${name}`} style={{ textDecoration: "none" }}>
          <div className="col-12 btn-button btn-main btn-large d-flex mt-3 mt-lg-5 mb-2">
            View Insights
          </div>
        </Link>
      )}
    </>
  );
}
