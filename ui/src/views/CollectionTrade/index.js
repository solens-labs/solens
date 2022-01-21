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
import CollectionListedItems from "../../components/CollectionListedItems";
import CollectionAllItems from "../../components/CollectionAllItems";

export default function CollectionItems(props) {
  const { name } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const allCollections = useSelector(selectAllCollections);
  // const storedCollection = useSelector(selectCollection);
  // const storedCollectionName = useSelector(selectCollectionName);
  // const items = useSelector(selectCollectionMints);

  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionLinks, setCollectionLinks] = useState({}); // needed for collection details
  const [collectionListed, setCollectionListed] = useState([]); // all listed items across all MPs
  const [collectionItems, setCollectionItems] = useState([]); // all collection mints
  const [collectionActivity, setCollectionActivity] = useState([]);

  const [marketplaces, setMarketplaces] = useState([]); // number of MPs the collection is on
  const [noCollection, setNoCollection] = useState(false); // redirect user on incorrect symbol

  const [currentView, setCurrentView] = useState("listed");

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
            // setCollectionListed(listedItems);
            // const sortedListeditems = sortItems(listedItems, "price_lth");
            setCollectionListed(listedItems);
          });

        const apiRequest3 = api.server.collectionHistory + name;
        const collectionActivity = await axios
          .get(apiRequest3)
          .then((response) => {
            const activity = response.data;
            const converted = "";
            setCollectionActivity(converted);
          });
      }
    }
  }, [name, allCollections]);

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
      </div>

      {currentView === "listed" && (
        <CollectionListedItems listedItems={collectionListed} name={name} />
      )}

      {currentView === "all" && (
        <CollectionAllItems allItems={collectionItems} name={name} />
      )}

      {currentView === "activity" && (
        <CollectionActivity activity={collectionActivity} />
      )}

      <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
}
