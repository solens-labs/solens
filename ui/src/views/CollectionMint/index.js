import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.css";
import Loader from "../../components/Loader";
import { api, queries } from "../../constants/constants";
import axios from "axios";
import SocialLinks from "../../components/SocialLinks";

const style = {
  height: 30,
  border: "1px solid green",
  // width: "50%",
  // margin: 6,
  // padding: 8,
};

export default function CollectionMint(props) {
  const { name } = useParams();

  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionLinks, setCollectionLinks] = useState({}); // needed for collection details
  const [collectionMintList, setCollectionMintList] = useState([]); // needed on API pull

  const [items, setItems] = useState(Array.from({ length: 200 }));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    if (items.length >= 1000) {
      setHasMore(false);
      return;
    }

    const newItems = Array.from({ length: 20 });
    const fullItems = [...items, ...newItems];
    setItems(fullItems);
  };

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
            {items.map((i, index) => (
              <div className="col-12 col-lg-3" style={style} key={index}>
                div - #{index}
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
