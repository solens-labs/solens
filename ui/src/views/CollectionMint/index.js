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
} from "../../constants/constants";
import axios from "axios";
import SocialLinks from "../../components/SocialLinks";
import NftCard from "../../components/NftCard";
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

export default function CollectionMint(props) {
  const { name } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const allCollections = useSelector(selectAllCollections);
  const storedCollectionName = useSelector(selectCollectionName);
  const items = useSelector(selectCollectionMints);

  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionLinks, setCollectionLinks] = useState({}); // needed for collection details
  const [collectionMintList, setCollectionMintList] = useState([]); // all mint addresses to request metadata
  const [marketplaces, setMarketplaces] = useState([]);
  const [noCollection, setNoCollection] = useState(false); // redirect user on incorrect symbol
  // const [items, setItems] = useState([]); // needed for collection nft grid items
  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end

  useEffect(() => {
    if (storedCollectionName !== name) {
      dispatch(setCollectionMints([]));
      dispatch(setCollectionName(name));
    }
  }, [storedCollectionName, name]);

  // Fetch Collection Data
  useEffect(async () => {
    if (name && allCollections.length > 0) {
      const filterCheck = allCollections.filter((item) => item.symbol === name);
      const result = filterCheck.length > 0;
      if (!result) {
        setNoCollection(true);
        return;
      }

      if (result) {
        const apiRequest =
          api.collection + queries.symbol + name + queries.mintList;
        const collectionInfo = await axios.get(apiRequest).then((response) => {
          const collectionInfo = response.data[0];

          setCollectionInfo(collectionInfo);
          setCollectionMintList(collectionInfo.mint);

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
      }
    }
  }, [name, allCollections]);

  // useEffect(() => {
  //   setItems(storedItems);
  // }, [storedItems]);

  // Set Initial Items
  useEffect(async () => {
    if (items.length > 0 && storedCollectionName === name) {
      // setItems(items);
      return;
    }

    if (collectionMintList.length > 0 && items.length === 0) {
      const initialItems = collectionMintList.slice(0, 20);
      const initialMetadata = initialItems.map(async (item, i) => {
        const tokenMD = await getTokenMetadata(item);
        return tokenMD;
      });
      const initialResolved = await Promise.all(initialMetadata);
      dispatch(setCollectionMints(initialResolved));
    }
  }, [collectionMintList, storedCollectionName, name, items]);

  // Add more mint addresses to items
  const fetchMoreData = async () => {
    if (items.length > 0 && items.length >= collectionMintList.length) {
      setHasMore(false);
      return;
    }

    const newMints = collectionMintList.slice(items.length, items.length + 20);
    const newMetadata = newMints.map(async (item, i) => {
      const tokenMD = await getTokenMetadata(item);
      return tokenMD;
    });
    const newResolved = await Promise.all(newMetadata);
    const fullItems = [...items, ...newResolved];
    dispatch(setCollectionMints(fullItems));
  };

  // Scroll to Top Button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  const selectNft = (mint) => {
    history.push("/mint/" + mint);
  };

  // Top NFTs nft detail page link
  const nftPageLink = (item) => {
    let detailPageLink = "";
    if (item.mint) {
      detailPageLink = `/mint/` + item.mint;
    }
    const externalLink = explorerLink("token", item.mint);
    return detailPageLink ? detailPageLink : externalLink;
  };

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
          <Link to={`/collection/${name}`} style={{ textDecoration: "none" }}>
            <div className="col-12 btn-button btn-main btn-large d-flex mt-2 mb-2">
              View Insights
            </div>
          </Link>
        </div>
      </div>

      <div className="col-12 col-lg-10">
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
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
                    onClick={() => selectNft(item.mint)}
                  >
                    {/* <a
                      href={nftPageLink(item)}
                      style={{ textDecoration: "none", color: "white" }}
                    > */}
                    <NftCard item={item} links={getItemLinks(item.mint)} />
                    {/* </a> */}
                  </div>
                );
              })}
          </div>
        </InfiniteScroll>
      </div>

      {items.length > 0 && hasMore && (
        <div
          className="col-12 btn-button btn-main btn-large d-flex mt-3 mt-lg-5 mb-2"
          onClick={fetchMoreData}
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
