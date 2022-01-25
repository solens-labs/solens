import React, { useEffect, useState } from "react";
import { getTokenMetadata } from "../../utils/getMetadata";
import NftCard from "../CardNft/userListed";
import { filterData, sortData } from "../../utils/sortAndSearch";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../Loader";
import { Link } from "react-router-dom";
import { fetchItemsMetadata } from "../../utils/getItemsMetadata";
import { sortItems } from "../../utils/sortItems";

export default function CollectionListedItems(props) {
  const {
    listedItems,
    name,
    listedItemsMetadata,
    setListedItemsMetadata,
    setListedItemsSort,
  } = props;

  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end

  // Infinite Scroll Data Fetch
  const fetchItems = async () => {
    if (
      listedItemsMetadata.length > 0 &&
      listedItemsMetadata.length === listedItems.length
    ) {
      setHasMore(false);
      return;
    }
    const itemsMetadata = await fetchItemsMetadata(
      listedItemsMetadata,
      listedItems
    );
    setListedItemsMetadata(itemsMetadata);
  };

  return (
    <>
      <div className="col-12 p-2">
        <h1 className="">{listedItems?.length || "Loading"} Listed Items</h1>
      </div>

      <div className="col-12 d-flex flex-wrap col-xl-8 mb-4 justify-content-around">
        <select
          name="sort_mints"
          id="sort_mints"
          className="select_collection_filter"
          onChange={(e) => {
            setListedItemsSort(e.target.value);
          }}
        >
          <option value="" disabled selected>
            Sort by
          </option>
          <option value="price_htl">Price - High to Low</option>
          <option value="price_lth">Price - Low to High</option>
          {/* <option value="recent">Listed - Recent</option> */}
          {/* <option value="mint_solanart">Solanart</option> */}
          {/* <option value="mint_magiceden">Magic Eden</option> */}
        </select>

        {/* <input
          type="text"
          placeholder="Search"
          className="search_collection_input"
          onChange={(e) => setSearch(e.target.value)}
        /> */}
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

      {listedItemsMetadata.length > 0 && hasMore && (
        <div
          className="col-12 btn-button btn-main btn-large d-flex mt-3 mt-lg-5 mb-2"
          onClick={fetchItems}
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
