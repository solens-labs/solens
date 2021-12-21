import React, { useState, useEffect, useMemo } from "react";
import "./Home.css";

import { useLocation, Switch, Route } from "react-router-dom";
import { selectCollection, selectColorMode, setDebugMode } from "../redux/app";
import { useSelector, useDispatch } from "react-redux";
import ItemPage from "../components/ItemPage";
import CollectionList from "../components/CollectionList";
import CollectionPage from "../components/CollectionPage";
import { selectAllCollections, setAllCollections } from "../redux/app";
import axios from "axios";
import Navigation from "../components/Navigation";
import LandingPage from "../components/LandingPage";
import { endpoints } from "../constants/constants";
import ScrollToTop from "../utils/ScrollToTop";
import createHistory from "history/createBrowserHistory";
import ReactGA from "react-ga";

export default function Home(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const debug = false;
    dispatch(setDebugMode(debug));
  }, []);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  // Get Global State Collections List
  const allCollections = useSelector(selectAllCollections);

  // Fetch All Collections & Send to Global State
  useEffect(async () => {
    if (allCollections.length === 0) {
      const collectionsData = await axios
        .get(endpoints.api.getAllCollections)
        .then((response) => {
          const collections = response.data;
          const collectionsAboveZero = collections.filter((collection) => {
            return collection.total_volume > 0;
          });
          const dailyChangeAdded = collectionsAboveZero.map((collection) => {
            const volumeToday = collection.daily_volume;
            const volumeYesterday = collection.past_day_volume;
            let change =
              ((volumeToday - volumeYesterday) / volumeYesterday) * 100;

            if (volumeYesterday === 0) {
              change = 100;
            }
            const addedStat = { ...collection, daily_change: change };
            return addedStat;
          });

          // console.log(dailyChangeAdded);
          dispatch(setAllCollections(dailyChangeAdded));
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <div className="App col-12">
      <div className="navigation d-flex flex-column align-items-center col-12">
        <Navigation />
      </div>

      <div className="page_content col-12">
        <ScrollToTop />
        <Switch>
          <Route path exact="/" component={LandingPage} />
          <Route path="/collections" component={CollectionList} />
          <Route path="/collection/:name" component={CollectionPage} />
          <Route path="/item" component={ItemPage} />
          <Route path="*" component={LandingPage} />
        </Switch>
      </div>

      {/* <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button> */}
    </div>
  );
}
