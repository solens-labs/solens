import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../components/Loader";
import "./style.css";
// import { collections } from "../../constants/constants";
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
import CollectionsList from "../CollectionsList";
import CollectionsGrid from "../CollectionsGrid";
import ViewToggleButtons from "../../components/ButtonsViewToggle";

export default function Collections(props) {
  const dispatch = useDispatch();

  const [viewType, setViewType] = useState("list");

  const view = {
    viewType: viewType,
    setViewType: setViewType,
  };

  return (
    <div className="collections_parent d-flex flex-column align-items-center col-12 mb-5">
      <Helmet>
        <title>Solens - Collections</title>
        <meta
          name="description"
          content="Explore and trade Solana NFT Collections. Get analytics, recent activity, and more."
        />
      </Helmet>

      <div className="d-flex flex-coulmn col-12">
        {viewType === "list" && <CollectionsList view={view} />}

        {viewType === "grid" && <CollectionsGrid view={view} />}
      </div>
    </div>
  );
}
