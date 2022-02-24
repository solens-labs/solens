import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../components/Loader";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  selectAllCollections,
  setAllCollections,
  selectAllStats,
  setCollection,
  setAllStats,
  selectSort,
  setSort,
  setShowMore,
  selectShowMore,
} from "../../redux/app";
import ToolBar from "../../components/ToolBar";
import CollectionCard from "../../components/CardCollection";
import { sortData, filterData } from "../../utils/sortAndSearch";
import ReactGA from "react-ga";
import CollectionCardMobile from "../../components/CardCollectionMobile";
import { Helmet } from "react-helmet";
import convertCollectionsList from "../../utils/convertCollectionsList";
import CollectionsTable from "../../components/TableCollectionsList";

export default function CollectionsList(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const allCollections = useSelector(selectAllCollections);

  const [collections, setCollections] = useState([]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  // Convert Data to Table Format
  useEffect(() => {
    if (allCollections?.length > 0) {
      const data = convertCollectionsList(allCollections);
      setCollections(data);
    }
  }, [allCollections]);

  // Select individual collection for details
  const selectCollection = (collection) => {
    dispatch(setCollection(collection));
    const symbol = collection.symbol;
    history.push("/collection/" + symbol); // COLLECTION LANDING LINK
  };

  return (
    <div className="collection_list d-flex flex-column align-items-center col-12 p-5 pt-0 pb-0 mt-4 mb-5">
      <Helmet>
        <title>Solens - Collections</title>
        <meta
          name="description"
          content="Explore and trade Solana NFT Collections. Get analytics, recent activity, and more."
        />
      </Helmet>

      <h1>{collections.length !== 0 && collections.length} Collections</h1>

      {collections.length === 0 && (
        <div className="mt-5 mb-5">
          <Loader />
        </div>
      )}

      <div className="chartbox col-12 d-flex flex-row flex-wrap justify-content-center mt-4">
        <CollectionsTable data={collections} />
      </div>

      <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
}
