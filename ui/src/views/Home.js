import React, { useState, useEffect, useMemo } from "react";
import "./Home.css";

import { useLocation, Switch, Route } from "react-router-dom";
import {
  selectCollection,
  selectColorMode,
  selectDailyVolume,
  selectSolPrice,
  selectWeeklyVolume,
  selectWhaleBuyers,
  selectWhaleBuyersDay,
  selectWhaleSellers,
  selectWhaleSellersDay,
  setDailyVolume,
  setDebugMode,
  setSolPrice,
  setWeeklyVolume,
  setWhaleBuyers,
  setWhaleBuyersDay,
  setWhaleSellers,
  setWhaleSellersDay,
} from "../redux/app";
import { useSelector, useDispatch } from "react-redux";
import ItemPage from "../components/ItemPage";
import CollectionList from "../components/CollectionList";
import CollectionPage from "../components/CollectionPage";
import { selectAllCollections, setAllCollections } from "../redux/app";
import axios from "axios";
import Navigation from "../components/Navigation";
import LandingPage from "../components/LandingPage";
import { api, links, queries } from "../constants/constants";
import ScrollToTop from "../utils/scrollToTop";
import createHistory from "history/createBrowserHistory";
import ReactGA from "react-ga";
import Wallets from "../components/Wallets";

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
  const whaleBuyersWeek = useSelector(selectWhaleBuyers);
  const whaleSellersWeek = useSelector(selectWhaleSellers);
  const whaleBuyersDay = useSelector(selectWhaleBuyersDay);
  const whaleSellersDay = useSelector(selectWhaleSellersDay);
  const volumeWeek = useSelector(selectWeeklyVolume);
  const solPrice = useSelector(selectSolPrice);
  const dailyVolume = useSelector(selectDailyVolume);

  // Fetch All Collections
  useEffect(async () => {
    if (allCollections.length === 0) {
      const collectionsData = await axios
        .get(api.allCollections)
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

          dispatch(setAllCollections(dailyChangeAdded));
        })
        .catch((error) => console.log(error));
    }
  }, []);

  // Fetch Market Data
  useEffect(async () => {
    if (volumeWeek === 0 && solPrice !== 0) {
      const apiRequest = api.marketStats + "?days=" + 365;
      const marketData = axios.get(apiRequest).then((response) => {
        const data = response.data.splice(-7);

        let weeklyVolumeCounter = 0;
        data.map((day) => {
          weeklyVolumeCounter += day.volume;
        });

        const weeklyConvertUSD = solPrice * weeklyVolumeCounter;
        dispatch(setWeeklyVolume(Math.floor(weeklyConvertUSD)));

        const todaysVolume = data[6].volume;
      });
    }
  }, [solPrice]);
  // Generate Daily Volume
  useEffect(() => {
    if (allCollections.length > 0 && solPrice > 0 && dailyVolume === 0) {
      const totalToday = allCollections.reduce(
        (sum, collection) => sum + collection.daily_volume,
        0
      );

      const convert = solPrice * totalToday;
      dispatch(setDailyVolume(Math.floor(convert)));
    }
  }, [allCollections, solPrice, dailyVolume]);

  // Fetch Whales Data
  useEffect(async () => {
    if (whaleBuyersWeek.length === 0) {
      const apiRequest =
        api.topTraders + "?type=buyers" + queries.days + 7 + queries.sortVolume;
      const whales = axios.get(apiRequest).then((response) => {
        const whaleList = response.data;
        dispatch(setWhaleBuyers(whaleList));
      });
    }

    if (whaleSellersWeek.length === 0) {
      const apiRequest =
        api.topTraders +
        "?type=sellers" +
        queries.days +
        7 +
        queries.sortVolume;
      const whales = axios.get(apiRequest).then((response) => {
        const whaleList = response.data;
        dispatch(setWhaleSellers(whaleList));
      });
    }

    if (whaleBuyersDay.length === 0) {
      const apiRequest =
        api.topTraders + "?type=buyers" + queries.days + 1 + queries.sortVolume;
      const whales = axios.get(apiRequest).then((response) => {
        const whaleList = response.data;
        dispatch(setWhaleBuyersDay(whaleList));
      });
    }

    if (whaleSellersDay.length === 0) {
      const apiRequest =
        api.topTraders +
        "?type=sellers" +
        queries.days +
        1 +
        queries.sortVolume;
      const whales = axios.get(apiRequest).then((response) => {
        const whaleList = response.data;
        dispatch(setWhaleSellersDay(whaleList));
      });
    }
  }, []);

  // Fetch SOL Price
  useEffect(() => {
    if (solPrice === 0) {
      axios.get(links.coingecko.solPrice).then((response) => {
        const price = response.data.solana.usd;
        dispatch(setSolPrice(price));
      });
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
          <Route path="/wallets" component={Wallets} />
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
