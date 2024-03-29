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
import ViewToggleButtons from "../../components/ButtonsViewToggle";

export default function CollectionsGrid(props) {
  const { view, allCollections } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState("");
  const sortSelected = useSelector(selectSort);
  const sortDefault = "daily_volume";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  // Search & Sort Functionality
  useEffect(() => {
    if (!search && sortSelected) {
      const sorted = sortData(allCollections, sortSelected);
      setCollections(sorted);
    } else if (search && !sortSelected) {
      const filtered = filterData(allCollections, search);
      setCollections(filtered);
    } else if (search && sortSelected) {
      const filtered = filterData(allCollections, search);
      const sorted = sortData(filtered, sortSelected);
      setCollections(sorted);
    } else if (!search && !sortSelected) {
      setCollections(allCollections);
    }
  }, [search, sortSelected]);

  // Make copy of data
  useEffect(() => {
    if (collections.length !== allCollections.length) {
      if (sortSelected) {
        const sorted = sortData(allCollections, sortSelected);
        setCollections(sorted);
      } else {
        const sorted = sortData(allCollections, sortDefault);
        setCollections(sorted);
      }
    }
  }, [allCollections]);

  // Select individual collection for details
  const selectCollection = (collection) => {
    dispatch(setCollection(collection));
    const symbol = collection.symbol;
    history.push("/collection/" + symbol); // COLLECTION LANDING LINK
  };

  const sendSortAnalytic = (sort) => {
    ReactGA.event({
      category: "Data",
      action: "Sort By",
      label: sort,
    });
  };

  return (
    <div className="collection_list d-flex flex-column align-items-center col-12 p-1 p-lg-3 p-xl-5 pt-0 pt-lg-0 pt-xl-0 pb-0 mt-4 mb-5">
      <div className="collections_number col-12 d-flex flex-row flex-wrap justify-content-center align-items-center">
        <div className="col-0 col-lg-4"></div>
        <div className="col-12 col-lg-4 d-flex flex-row justify-content-center align-items-center">
          <h1 style={{ margin: 0, padding: 0 }}>
            {collections.length !== 0 && collections.length} Collections
          </h1>
        </div>
        <div className="col-12 col-lg-4 d-flex flex-row justify-content-center justify-content-lg-end align-items-end p-xl-2 pt-0 pb-0 mb-2 mb-lg-0">
          <ViewToggleButtons
            setViewType={view.setViewType}
            viewType={view.viewType}
          />
        </div>
      </div>

      <div className="mb-4 d-flex flex-wrap col-12 col-lg-10 justify-content-around">
        <select
          name="sort"
          id="sort"
          className="select_collection_filter"
          defaultValue={sortSelected ? sortSelected : sortDefault}
          onChange={(e) => {
            dispatch(setSort(e.target.value));
            sendSortAnalytic(e.target.value);
          }}
        >
          <option value="" disabled selected>
            Sort by
          </option>
          <option value="total_volume">Volume - Total</option>
          <option value="weekly_volume">Volume - Week</option>
          <option value="past_day_volume">Volume - Yesterday</option>
          <option value="daily_volume">Volume - Today</option>
          <option value="daily_change">Volume - 24H Change</option>
          <option value="days_launched">Date - Released (Newest)</option>
        </select>

        <input
          type="text"
          placeholder="Search"
          className="search_collection_input"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* <button
          className="btn-button btn-main"
          onClick={() => {
            toggleShow();
          }}
        >
          Show More
        </button> */}
      </div>

      {allCollections.length === 0 && (
        <div className="mt-5 mb-5">
          <Loader />
        </div>
      )}

      {/* {collections.length === 0 && allCollections.length !== 0 && (
        <h1>None Found</h1>
      )} */}

      <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
        {collections.length !== 0 &&
          collections.map((collection, i) => {
            return (
              <div
                key={i}
                className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
              >
                <CollectionCard
                  sort={sortSelected ? sortSelected : sortDefault}
                  collection={collection}
                  id={i}
                  onClick={() => selectCollection(collection)}
                />
                {/* {showMore && (
                  <CollectionCardMobile
                    sort={sortSelected ? sortSelected : sortDefault}
                    collection={collection}
                    id={i}
                    onClick={() => selectCollection(collection)}
                  />
                )}

                {!showMore && (
                  <CollectionCard
                    sort={sortSelected ? sortSelected : sortDefault}
                    collection={collection}
                    id={i}
                    onClick={() => selectCollection(collection)}
                  />
                )} */}

                {/* <hr style={{ color: "white", margin: "20px 0px 30px 0px" }} /> */}
              </div>
            );
          })}
      </div>

      <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
}
