import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.css";
import Loader from "../../components/Loader";
import { api, explorerLink, queries } from "../../constants/constants";
import axios from "axios";
import SocialLinks from "../../components/SocialLinks";
import NftCard from "../../components/NftCard";
import { getTokenMetadata } from "../../utils/getMetadata";

export default function CollectionMint(props) {
  const { name } = useParams();

  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionLinks, setCollectionLinks] = useState({}); // needed for collection details
  const [collectionMintList, setCollectionMintList] = useState([]); // needed to request metadata

  const [items, setItems] = useState([]); // needed for collection nft grid items
  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end

  // Fetch Collection Data
  useEffect(async () => {
    const apiRequest =
      api.collection + queries.symbol + name + queries.mintList;
    const collectionInfo = await axios.get(apiRequest).then((response) => {
      const collectionInfo = response.data[0];
      setCollectionInfo(collectionInfo);
      setCollectionMintList(collectionInfo.mint);

      const links = {
        website: collectionInfo.website,
        twitter: collectionInfo.twitter,
        discord: collectionInfo.discord,
      };
      setCollectionLinks(links);
    });
  }, [name]);

  // Set Initial Items
  useEffect(async () => {
    if (collectionMintList.length > 0) {
      const initialItems = collectionMintList.slice(0, 20);
      const initialMetadata = initialItems.map(async (item, i) => {
        const tokenMD = await getTokenMetadata(item);
        return tokenMD;
      });
      const initialResolved = await Promise.all(initialMetadata);
      setItems(initialResolved);
    }
  }, [collectionMintList]);

  // Add more mint addresses to items
  const fetchMoreData = async () => {
    if (items.length >= collectionMintList.length) {
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
    setItems(fullItems);
  };

  // Scroll to Top Button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="collection_page d-flex flex-column align-items-center col-12 mt-4 mt-lg-5">
      <div className="collection_details d-flex flex-wrap col-12 col-lg-10 col-xxl-8 mb-3 mb-lg-5">
        <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
          {collectionInfo.image ? (
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
          <h1 className="collection_name_large">{collectionInfo.name}</h1>
          {collectionLinks.website ||
          collectionLinks.twitter ||
          collectionLinks.discord ? (
            <SocialLinks links={collectionLinks} />
          ) : (
            ""
          )}
          <p className="collection_description">{collectionInfo.description}</p>
          <Link to={`/collection/${name}`} style={{ textDecoration: "none" }}>
            <div className="col-12 btn-button btn-main btn-large d-flex mt-2 mb-2">
              View Insights
            </div>
          </Link>
        </div>
      </div>

      <div className="col-10">
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
            {items.map((item, i) => {
              return (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3 p-1 p-md-2 p-lg-3"
                  key={i}
                >
                  <NftCard
                    item={item}
                    link={explorerLink("token", item.mint)}
                  />
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      </div>

      <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
}
