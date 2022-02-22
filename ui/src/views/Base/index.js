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
  setTopNFTsDay,
  selectTopNFTsDay,
  setTradingEnabled,
} from "../../redux/app";
import { useSelector, useDispatch } from "react-redux";
import MintPage from "../MintPage";
import Collections from "../Collections";
import CollectionPage from "../CollectionPage";
import { selectAllCollections, setAllCollections } from "../../redux/app";
import axios from "axios";
import Navigation from "../../components/Navigation";
import HomePage from "../Home";
import { api, links, queries } from "../../constants/constants";
import ReactGA from "react-ga";
import Wallets from "../Wallets";
import ScrollToTop from "../../utils/ScrollToTop";
import { getTokenMetadata } from "../../utils/getMetadata";
import { calculateLaunchDate } from "../../utils/collectionStats";
import Launchzone from "../Launchzone";
import Footer from "../../components/Footer";
import Apply from "../Apply";
import User from "../User";
import CollectionTrade from "../CollectionTrade";
import LaunchzoneMint from "../LaunchzoneMint";
import SiteBanner from "../../components/SiteBanner";

export default function Home(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  // TRADING MASTER SWITCH
  const trading = false;
  useEffect(() => {
    dispatch(setTradingEnabled(trading));
  }, []);

  useEffect(() => {
    const debug = false;
    dispatch(setDebugMode(debug));
  }, []);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  const [pageContentStyle, setPageContentStyle] = useState("page_content");

  useEffect(() => {
    if (location.pathname === "/launch") {
      setPageContentStyle("page_content_launch");
    } else {
      setPageContentStyle("page_content");
    }
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
  const topNFTsDay = useSelector(selectTopNFTsDay);

  // Fetch All Collections
  useEffect(async () => {
    if (allCollections.length === 0) {
      const collectionsData = await axios
        .get(api.server.allCollections)
        .then((response) => {
          const collections = response.data;
          // const collectionsAboveZero = collections.filter((collection) => {
          //   return collection.total_volume > 0;
          // });
          const dailyChangeAdded = collections.map((collection) => {
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

          const daysLaunchedAdded = dailyChangeAdded.map((collection) => {
            const daysSinceLaunch = calculateLaunchDate(collection);
            const addedStat = { ...collection, days_launched: daysSinceLaunch };
            return addedStat;
          });

          dispatch(setAllCollections(daysLaunchedAdded));
        })
        .catch((error) => console.log(error));
    }
  }, []);

  // Fetch Weekly Volume
  useEffect(async () => {
    if (volumeWeek === 0 && solPrice !== 0) {
      // const apiRequest = api.server.marketStats + "?days=" + 365;
      const apiRequest = api.server.marketVolume;
      const marketData = axios.get(apiRequest).then((response) => {
        const marketVolumeSOL = response.data[0];

        const marketVolumeConvert = solPrice * marketVolumeSOL.volume;

        dispatch(setWeeklyVolume(Math.floor(marketVolumeConvert)));
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
        api.server.topTraders +
        "?all_time=true" +
        "&type=buyers" +
        queries.sortVolume;
      const wallets = axios.get(apiRequest).then((response) => {
        const walletList = response.data;
        dispatch(setWalletBuyers(walletList));
      });
    }

    if (walletSellersWeek.length === 0) {
      const apiRequest =
        api.server.topTraders +
        "?all_time=true" +
        "&type=sellers" +
        queries.sortVolume;
      const wallets = axios.get(apiRequest).then((response) => {
        const walletList = response.data;
        dispatch(setWalletSellers(walletList));
      });
    }

    if (walletBuyersDay.length === 0) {
      const apiRequest =
        api.server.topTraders +
        "?all_time=false" +
        "&type=buyers" +
        queries.sortVolume;
      const wallets = axios.get(apiRequest).then((response) => {
        const walletList = response.data;
        dispatch(setWalletBuyersDay(walletList));
      });
    }

    if (walletSellersDay.length === 0) {
      const apiRequest =
        api.server.topTraders +
        "?all_time=false" +
        "&type=sellers" +
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

  // Fetch Top NFTs
  useEffect(async () => {
    if (topNFTsDay.length === 0) {
      const apiRequest = api.server.topNFTs + "?days=" + 1;
      const topFourNFTs = await axios.get(apiRequest).then((response) => {
        const nfts = response.data;
        const topFour = nfts.slice(0, 4);
        return topFour;
      });

      const tokenMetadata = topFourNFTs.map(async (item, i) => {
        const tokenMD = await getTokenMetadata(item.mint);
        tokenMD["price"] = topFourNFTs[i].price;
        tokenMD["internal_symbol"] = topFourNFTs[i].symbol
          ? topFourNFTs[i].symbol
          : "";

        return tokenMD;
      });

      const resolved = await Promise.all(tokenMetadata);
      dispatch(setTopNFTsDay(resolved));
    }
  }, []);

  return (
    <div className="app col-12">
      <div className="navigation col-12">
        <SiteBanner />
        <Navigation />
      </div>

      <div className={`${pageContentStyle} col-12`}>
        <ScrollToTop />
        <Switch>
          <Route exact strict path="/launch" component={Launchzone} />
          <Route path exact="/" component={HomePage} />
          <Route path="/collections" component={Collections} />
          <Route path="/collection/:name" component={CollectionPage} />
          <Route path="/nfts/:name" component={CollectionTrade} />
          <Route path="/wallets" component={Wallets} />
          <Route path="/apply" component={Apply} />
          <Route path="/user" component={User} />
          <Route path="/launch/:symbol" component={LaunchzoneMint} />
          <Route path="/mint/:address" component={MintPage} />
          <Route path="*" component={HomePage} />
        </Switch>
      </div>

      {/* <button className="scroll_top" onClick={scrollToTop}>
        Top
      </button> */}

      <div className="col-12">
        <Footer />
      </div>
    </div>
  );
}
