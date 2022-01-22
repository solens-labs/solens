import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.css";
import Loader from "../../components/Loader";
import {
  api,
  exchangeApi,
  explorerLink,
  queries,
  themeColors,
} from "../../constants/constants";
import axios from "axios";
import SocialLinks from "../../components/SocialLinks";
import NftCard from "../../components/NftCard";
import NftCardView from "../../components/NftCard/userprofile";
import { getTokenMetadata } from "../../utils/getMetadata";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCollections,
  selectCollection,
  selectCollectionMints,
  selectCollectionName,
  setCollection,
  setCollectionMints,
  setCollectionName,
} from "../../redux/app";
import { filterData, sortData } from "../../utils/sortAndSearch";

export default function CollectionItems(props) {
  const { name } = useParams();
  const dispatch = useDispatch();
  const allCollections = useSelector(selectAllCollections);
  // const storedCollection = useSelector(selectCollection);
  // const storedCollectionName = useSelector(selectCollectionName);
  // const items = useSelector(selectCollectionMints);

  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionLinks, setCollectionLinks] = useState({}); // needed for collection details
  const [collectionListed, setCollectionListed] = useState([]); // all listed items across all MPs
  const [collectionItems, setCollectionItems] = useState([]); // all collection mints

  const [marketplaces, setMarketplaces] = useState([]); // number of MPs the collection is on
  const [noCollection, setNoCollection] = useState(false); // redirect user on incorrect symbol
  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end
  const [seeAllItems, setSeeAllItems] = useState(false); // needed to toggle listed items/all items

  const [items, setItems] = useState([]); // items always displayed on page and used in infinite scroll
  const [sortSelected, setSortSelected] = useState(""); // selected sort option

  // Toggle between Listed Items & All Items
  useEffect(async () => {
    if (!seeAllItems && collectionListed.length > 0) {
      setItems([]);
      const initialItems = await setInitialItems(collectionListed);
      setItems(initialItems);
    }

    if (seeAllItems && collectionItems.length > 0) {
      setItems([]);
      const initialItems = await setInitialItems(collectionItems);
      setItems(initialItems);
    }
  }, [seeAllItems, collectionItems, collectionListed]);

  // Listen for sort events and set collection listed persist + page items
  useEffect(async () => {
    if (sortSelected) {
      setItems([]);
      const sortedItems = sortItems(collectionListed, sortSelected);
      setCollectionListed(sortedItems);
      const initialItems = await setInitialItems(collectionListed);
      setItems(initialItems);
    }
  }, [sortSelected, seeAllItems]);

  const sortItems = (allItems, sortSelected) => {
    if (sortSelected && allItems.length > 0) {
      let sortType = "";
      let reverse = false;

      switch (sortSelected) {
        case "price_htl":
          sortType = "price";
          break;
        case "price_lth":
          sortType = "price";
          reverse = true;
          break;
        default:
          sortType = "price";
          reverse = true;
      }

      const sorted = sortData(allItems, sortType);
      if (reverse) {
        sorted.reverse();
      }
      return sorted;
    }
  };

  const setInitialItems = async (allItems) => {
    const intitialItems = allItems.slice(0, 20);
    const intitialItemsMetadata = await fetchItemsMetadata([], intitialItems);

    return intitialItemsMetadata;
  };

  // Fetch Collection Data, All Items, & Listed Items
  useEffect(async () => {
    if (name && allCollections.length > 0) {
      const filterCheck = allCollections.filter((item) => item.symbol === name);
      const result = filterCheck.length > 0;
      if (!result) {
        setNoCollection(true);
        return;
      }

      // if (storedCollection && storedCollectionName === name) {
      //   console.log(storedCollection);
      //   console.log(name);
      //   return;
      // }

      if (result) {
        const apiRequest =
          api.server.collection + queries.symbol + name + queries.mintList;
        const collectionInfo = await axios.get(apiRequest).then((response) => {
          const collectionInfo = response.data[0];

          setCollectionInfo(collectionInfo);

          const collectionMints = collectionInfo?.mint.map((item) => {
            return {
              mint: item,
            };
          });
          setCollectionItems(collectionMints);

          const marketplacesArray = [];
          if (collectionInfo) {
            collectionInfo.alltimestats.map((item, i) => {
              marketplacesArray.push(item.marketplace);
            });
          }
          setMarketplaces(marketplacesArray);

          const links = {
            website: collectionInfo.website,
            twitter: collectionInfo.twitter,
            discord: collectionInfo.discord,
          };
          setCollectionLinks(links);
        });

        const apiRequest2 = api.server.listings + queries.symbol + name;
        const collectionListed = await axios
          .get(apiRequest2)
          .then((response) => {
            const listedItems = response.data;
            const sortedListeditems = sortItems(listedItems, "price_lth");
            setCollectionListed(sortedListeditems);
          });
      }
    }
  }, [name, allCollections]);

  // Infinite Scroll Data Fetch
  const fetchAndSetItems = async (items, fullList) => {
    if (items.length > 0 && items.length >= fullList.length) {
      setHasMore(false);
      return;
    }
    if (items.length === 0 && fullList.length === 0) {
      return;
    }
    const itemsMetadata = await fetchItemsMetadata(items, fullList);
    setItems(itemsMetadata);
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

  // Scroll to Top Button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Get Explorer links for NFT Cards
  const getItemLinks = (mint) => {
    const links = {};
    if (marketplaces.includes("smb")) {
      links["smb"] = exchangeApi.smb.itemDetails + mint;
    }
    if (marketplaces.includes("magiceden")) {
      links["magiceden"] = exchangeApi.magiceden.itemDetails + mint;
    }
    if (marketplaces.includes("solanart")) {
      links["solanart"] = exchangeApi.solanart.itemDetails + mint;
    }
    return links;
  };

  const selectedItems = () => {
    if (seeAllItems) {
      return collectionItems;
    }

    if (!seeAllItems) {
      return collectionListed;
    }
  };

  // Store collection name in redux
  // useEffect(() => {
  //   if (storedCollectionName !== name) {
  //     dispatch(setCollectionMints([]));
  //     dispatch(setCollectionName(name));
  //   }
  // }, [storedCollectionName, name]);

  return (
    <div className="collection_page d-flex flex-column align-items-center col-12 mt-4 mt-lg-5">
      {noCollection && <Redirect to="/" />}
      <div className="collection_details d-flex flex-wrap col-12 col-lg-10 col-xxl-8 mb-3 mb-lg-5">
        <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
          {collectionInfo && collectionInfo.image ? (
            <img
              src={collectionInfo.image}
              alt="collection_image"
              className="collection_image_large img-fluid"
            />
          ) : (
            <div className="collection_image_large d-flex justify-content-center overflow-hidden">
              <Loader />
            </div>
          )}
        </div>
        <div className="collection_header col-12 col-lg-7 d-flex flex-column align-items-center justify-content-around">
          {collectionInfo && collectionInfo.name ? (
            <h1 className="collection_name_large">{collectionInfo.name}</h1>
          ) : (
            <Loader />
          )}
          {collectionLinks.website ||
          collectionLinks.twitter ||
          collectionLinks.discord ? (
            <SocialLinks links={collectionLinks} />
          ) : (
            ""
          )}
          <p className="collection_description">
            {collectionInfo && collectionInfo.description}
          </p>
          <Link
            to={`/collection/${name}`}
            style={{ textDecoration: "none", width: "70%" }}
          >
            <div className="col-12 btn-button btn-main btn-large btn-wide d-flex mt-2 mb-2">
              View Insights
            </div>
          </Link>
        </div>
      </div>

      <hr
        style={{ color: themeColors[0], width: "50%" }}
        className="mt-0 mb-4"
      />

      <div className="col-12 col-lg-8 col-xl-6 col-xxl-5 d-flex flex-row flex-wrap justify-content-center mb-3">
        <div className="col-6 p-1 p-lg-3 pt-0 pb-0">
          <div
            className={`btn-button btn-tall btn-wide ${
              seeAllItems ? "btn_color_selected" : "btn_color_outside"
            } d-flex mt-2 mb-2`}
            onClick={() => setSeeAllItems(false)}
          >
            {!seeAllItems && (
              <div className="btn_color_inner">Listed Items</div>
            )}
            {seeAllItems && "Listed Items"}
          </div>
        </div>
        <div className="col-6 p-1 p-lg-3 pt-0 pb-0">
          <div
            className={`btn-button btn-tall btn-wide ${
              !seeAllItems ? "btn_color_selected" : "btn_color_outside"
            } d-flex mt-2 mb-2`}
            onClick={() => setSeeAllItems(true)}
          >
            {seeAllItems && <div className="btn_color_inner">All Items</div>}
            {!seeAllItems && "All Items"}
          </div>
        </div>
      </div>

      {!seeAllItems && (
        <>
          <h1 className="mt-0 mt-xxl-3">
            {collectionListed?.length || "Loading"} Listed Items
          </h1>

          <div className="col-12 d-flex flex-wrap col-xl-8 mb-4 justify-content-around">
            <select
              name="sort_mints"
              id="sort_mints"
              className="select_collection_filter"
              onChange={(e) => {
                setSortSelected(e.target.value);
              }}
            >
              <option value="" disabled selected>
                Sort by
              </option>
              <option value="price_htl">Price - High to Low</option>
              <option value="price_lth">Price - Low to High</option>
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
        </>
      )}

      {seeAllItems && (
        <h1 className="mt-0 mt-xxl-3">
          {collectionItems?.length || "Loading"} Total Items
        </h1>
      )}

      <div className="col-12 col-lg-10">
        <InfiniteScroll
          dataLength={items.length}
          next={() => fetchAndSetItems(items, selectedItems())}
          hasMore={hasMore}
          loader={
            <div className="mt-5 mb-5">
              <Loader />
            </div>
          }
        >
          {!seeAllItems && (
            <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
              {items.length > 0 &&
                items.map((item, i) => {
                  return (
                    <div
                      className="nft_grid_card col-12 col-sm-8 col-md-6 col-xl-4 col-xxl-3 p-2 p-lg-3"
                      key={i}
                    >
                      <NftCard item={item} links={getItemLinks(item.mint)} />
                    </div>
                  );
                })}
            </div>
          )}
          {seeAllItems && (
            <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
              {items.length > 0 &&
                items.map((item, i) => {
                  return (
                    <div
                      className="nft_grid_card col-12 col-sm-8 col-md-6 col-xl-4 col-xxl-3 p-2 p-lg-3"
                      key={i}
                    >
                      <NftCardView
                        item={item}
                        links={getItemLinks(item.mint)}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </InfiniteScroll>
      </div>

      {items.length > 0 && hasMore && (
        <div
          className="col-12 btn-button btn-main btn-large d-flex mt-3 mt-lg-5 mb-2"
          onClick={() => fetchAndSetItems(items, collectionListed)}
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

      <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
}