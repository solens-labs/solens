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
import NftCard from "../../components/CardNft";
import NftCardView from "../../components/CardNft/userWallet";
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
import CollectionActivity from "../../components/CollectionActivity";
import CollectionListedItems from "../../components/CollectionItemsListed";
import CollectionAllItems from "../../components/CollectionItemsAll";
import convertActivityCollection from "../../utils/convertActivityCollectionData";
import { fetchItemsMetadata } from "../../utils/getItemsMetadata";
import { sortItems } from "../../utils/sortItems";

export default function CollectionItems(props) {
  const { name } = useParams();
  const dispatch = useDispatch();
  const allCollections = useSelector(selectAllCollections);
  // const storedCollection = useSelector(selectCollection);
  // const storedCollectionName = useSelector(selectCollectionName);
  // const items = useSelector(selectCollectionMints);

  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionLinks, setCollectionLinks] = useState({}); // needed for collection details

  const [activity, setActivity] = useState([]); // recent collection activity
  const [allItems, setAllItems] = useState([]); // all collection mints
  const [listedItems, setListedItems] = useState([]); // all listed items across all MPs
  const [listedItemsMetadata, setListedItemsMetadata] = useState([]);
  const [allItemsMetadata, setAllItemsMetadata] = useState([]);
  const [listedItemsSort, setListedItemsSort] = useState(""); // selected sort option

  // const [marketplaces, setMarketplaces] = useState([]); // number of MPs the collection is on
  const [noCollection, setNoCollection] = useState(false); // redirect user on incorrect symbol
  const [currentView, setCurrentView] = useState("listed"); // which component to show

  // Check if valid collection & fetch/set info & all items metadata
  useEffect(async () => {
    if (name && allCollections.length > 0) {
      const filterCheck = allCollections.filter((item) => item.symbol === name);
      const result = filterCheck.length > 0;
      if (!result) {
        setNoCollection(true);
        return;
      }

      const apiRequest =
        api.server.collection + queries.symbol + name + queries.mintList;
      const collectionInfo = await axios
        .get(apiRequest)
        .then(async (response) => {
          const collectionInfo = response.data[0];
          setCollectionInfo(collectionInfo);
          const links = {
            website: collectionInfo.website,
            twitter: collectionInfo.twitter,
            discord: collectionInfo.discord,
          };
          setCollectionLinks(links);

          const collectionMints = collectionInfo?.mint.map((item) => {
            return {
              mint: item,
            };
          });
          setAllItems(collectionMints);
          const intitialItems = collectionMints.slice(0, 20);
          const intitialMetadata = await fetchItemsMetadata([], intitialItems);
          setAllItemsMetadata(intitialMetadata);

          // const marketplacesArray = [];
          // if (collectionInfo) {
          //   collectionInfo.alltimestats.map((item, i) => {
          //     marketplacesArray.push(item.marketplace);
          //   });
          // }
          // setMarketplaces(marketplacesArray);
        });
    }
  }, [name, allCollections]);

  // Fetch collection listed items
  useEffect(async () => {
    const apiRequest2 = api.server.listings + queries.symbol + name;
    const collectionListed = await axios
      .get(apiRequest2)
      .then(async (response) => {
        const listedItems = response.data;
        setListedItems(listedItems);
        // const sortedListeditems = sortItems(listedItems, "price_lth");
        // setListedItems(sortedListeditems);
      });
  }, [name]);

  // Fetch collection activity
  useEffect(async () => {
    const apiRequest3 = api.server.collectionHistory + name;
    const collectionActivity = await axios
      .get(apiRequest3)
      .then(async (response) => {
        const activity = response.data;
        const converted = await convertActivityCollection(activity);
        const resolved = await Promise.all(converted);
        setActivity(resolved);
      });
  }, [name]);

  // Wait for listedItems to change (initial & after sorting)
  useEffect(async () => {
    if (listedItems?.length > 0) {
      setListedItemsMetadata([]);
      const intitialItems = listedItems.slice(0, 20);
      const intitialMetadata = await fetchItemsMetadata([], intitialItems);
      setListedItemsMetadata(intitialMetadata);
    }
  }, [listedItems]);

  // Listen for sort events, sort, and set listedItems state
  useEffect(async () => {
    if (listedItemsSort) {
      const sortedItems = sortItems(listedItems, listedItemsSort);
      setListedItems(sortedItems);
    }
  }, [listedItemsSort]);

  // Scroll to Top Button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

      <div className="col-12 col-lg-8 col-xl-6 d-flex flex-row flex-wrap justify-content-center mb-3">
        <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
          <div
            className={`${
              currentView === "activity"
                ? "btn_color_outside"
                : "btn_color_selected"
            } btn-button btn-tall btn-wide d-flex mt-2 mb-2`}
            onClick={() => {
              setCurrentView("activity");
            }}
          >
            {currentView === "activity" && (
              <div className="btn_color_inner">Activity</div>
            )}
            {currentView !== "activity" && "Activity"}
          </div>
        </div>

        <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
          <div
            className={`${
              currentView === "listed"
                ? "btn_color_outside"
                : "btn_color_selected"
            } btn-button btn-tall btn-wide d-flex mt-2 mb-2`}
            onClick={() => {
              setCurrentView("listed");
            }}
          >
            {currentView === "listed" && (
              <div className="btn_color_inner">Listed</div>
            )}
            {currentView !== "listed" ? "Listed" : ""}
          </div>
        </div>

        <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
          <div
            className={`${
              currentView === "all" ? "btn_color_outside" : "btn_color_selected"
            } btn-button btn-tall btn-wide d-flex mt-2 mb-2`}
            onClick={() => {
              setCurrentView("all");
            }}
          >
            {currentView === "all" && (
              <div className="btn_color_inner">All Items</div>
            )}
            {currentView !== "all" ? "All Items" : ""}
          </div>
        </div>
      </div>

      {currentView === "listed" && (
        <CollectionListedItems
          listedItems={listedItems}
          name={name}
          listedItemsMetadata={listedItemsMetadata}
          setListedItemsMetadata={setListedItemsMetadata}
          listedItemsSort={listedItemsSort}
          setListedItemsSort={setListedItemsSort}
        />
      )}

      {currentView === "all" && (
        <CollectionAllItems
          allItems={allItems}
          name={name}
          allItemsMetadata={allItemsMetadata}
          setAllItemsMetadata={setAllItemsMetadata}
        />
      )}

      {currentView === "activity" && <CollectionActivity activity={activity} />}

      <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
}
