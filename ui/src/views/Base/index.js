import React, { useState, useEffect, useMemo } from "react";
import "./style.css";

import { useLocation, Switch, Route } from "react-router-dom";
import {
  selectCollection,
  selectColorMode,
  selectDailyVolume,
  selectSolPrice,
  selectWeeklyVolume,
  selectWalletBuyers,
  selectWalletBuyersDay,
  selectWalletSellers,
  selectWalletSellersDay,
  setDailyVolume,
  setDebugMode,
  setSolPrice,
  setWeeklyVolume,
  setWalletBuyers,
  setWalletBuyersDay,
  setWalletSellers,
  setWalletSellersDay,
} from "../../redux/app";
import { useSelector, useDispatch } from "react-redux";
import ItemPage from "../../components/ItemPage";
import Collections from "../Collections";
import CollectionPage from "../CollectionPage";
import { selectAllCollections, setAllCollections } from "../../redux/app";
import axios from "axios";
import Navigation from "../../components/Navigation";
import HomePage from "../Home";
import { api, links, queries } from "../../constants/constants";
import ReactGA from "react-ga";
import Wallets from "../Wallets";
import ScrollToTop from "../../utils/scrollToTop";

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
  const walletBuyersWeek = useSelector(selectWalletBuyers);
  const walletSellersWeek = useSelector(selectWalletSellers);
  const walletBuyersDay = useSelector(selectWalletBuyersDay);
  const walletSellersDay = useSelector(selectWalletSellersDay);
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
          console.log(collections);
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

  // Fetch Wallets Data
  useEffect(async () => {
    if (walletBuyersWeek.length === 0) {
      const apiRequest =
        api.topTraders + "?type=buyers" + queries.days + 7 + queries.sortVolume;
      const wallets = axios.get(apiRequest).then((response) => {
        const walletList = response.data;
        dispatch(setWalletBuyers(walletList));
      });
    }

    if (walletSellersWeek.length === 0) {
      const apiRequest =
        api.topTraders +
        "?type=sellers" +
        queries.days +
        7 +
        queries.sortVolume;
      const wallets = axios.get(apiRequest).then((response) => {
        const walletList = response.data;
        dispatch(setWalletSellers(walletList));
      });
    }

    if (walletBuyersDay.length === 0) {
      const apiRequest =
        api.topTraders + "?type=buyers" + queries.days + 1 + queries.sortVolume;
      const wallets = axios.get(apiRequest).then((response) => {
        const walletList = response.data;
        dispatch(setWalletBuyersDay(walletList));
      });
    }

    if (walletSellersDay.length === 0) {
      const apiRequest =
        api.topTraders +
        "?type=sellers" +
        queries.days +
        1 +
        queries.sortVolume;
      const wallets = axios.get(apiRequest).then((response) => {
        const walletList = response.data;
        dispatch(setWalletSellersDay(walletList));
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
          <Route path exact="/" component={HomePage} />
          <Route path="/collections" component={Collections} />
          <Route path="/wallets" component={Wallets} />
          <Route path="/collection/:name" component={CollectionPage} />
          <Route path="/item" component={ItemPage} />
          <Route path="*" component={HomePage} />
        </Switch>
      </div>

      {/* <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button> */}
    </div>
  );
}
