import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../components/CollectionStats/style.css";
import "./style.css";
import { useSelector } from "react-redux";
import { selectCollection, selectDebugMode } from "../../redux/app";
import axios from "axios";
import { api, exchangeApi, queries } from "../../constants/constants";
import TradesTable from "../../components/TradesTable";
import TradersTable from "../../components/TradersTable";
import convertTradesData from "../../utils/convertTradesData";
import convertTradersData from "../../utils/convertTradersData";
import {
  calculateAllTimeTransactions,
  calculateAllTimeVolume,
  calculateLaunchDate,
  getMarketplaceData,
  splitMarketplaceData,
} from "../../utils/collectionStats";
import Loader from "../../components/Loader";
import MarketplaceCharts from "../../components/MarketplaceCharts";
import SocialLinks from "../../components/SocialLinks";

export default function CollectionPage(props) {
  const { name } = useParams();
  const debug = useSelector(selectDebugMode);

  const [timeframeTrades, setTimeframeTrades] = useState(1000);
  const [traderType, setTraderType] = useState("buyers");

  const [marketplacesData, setMarketplacesData] = useState([]); // needed for each MP's charts
  const [daysSinceCreated, setDaysSinceCreated] = useState(0); // needed for days launched
  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionVolume, setCollectionVolume] = useState(0); // needed for collection summary
  const [collectionAverage, setCollectionAverage] = useState(0); // needed for collection summary
  const [collectionTxCount, setCollectionTxCount] = useState(0); // needed for collection summary
  const [stats, setStats] = useState([]); // needed to populate collection summary
  const [topTradesAll, setTopTradesAll] = useState([]); // needed for table
  const [topTradesWeek, setTopTradesWeek] = useState([]); // needed for table
  const [topBuyers, setTopBuyers] = useState([]); // needed for table
  const [topSellers, setTopSellers] = useState([]); // needed for table
  const [topNFTsWeek, setTopNFTsWeek] = useState([]); // needed for section
  const [dailyStats, setDailyStats] = useState([]); // needed to populate charts
  const [marketplaces, setMarketplaces] = useState(0); // needed to figure out how many datasets to show
  const [collectionLinks, setCollectionLinks] = useState({});
  const [floorME, setFloorME] = useState(0); // needed for MP summary
  const [floorSA, setFloorSA] = useState(0); // needed for MP summary
  const [floor, setFloor] = useState(0); // needed for collection summary

  // Fetch Collection Data
  useEffect(async () => {
    const apiRequest = api.collection + queries.symbol + name;
    const collectionInfo = await axios.get(apiRequest).then((response) => {
      const collectionInfo = response.data[0];
      setCollectionInfo(collectionInfo);
      setStats(collectionInfo.alltimestats);
      setMarketplaces(collectionInfo.alltimestats.length);
      setDaysSinceCreated(calculateLaunchDate(collectionInfo));
      setDailyStats(collectionInfo.dailystats);

      const links = {
        website: collectionInfo.website,
        twitter: collectionInfo.twitter,
        discord: collectionInfo.discord,
      };
      setCollectionLinks(links);
    });
  }, [name]);

  // Fetch Top Data (top sales, trades, buyers, sellers)
  useEffect(async () => {
    if (topTradesAll.length === 0) {
      debug && console.log(`fetching top sales - ${name}`);
      const apiRequest =
        api.topTrades + queries.symbol + name + queries.days + 365;

      const topTradesAll = await axios
        // .get(`${api.getTopBuys}` + name) // NEED TO UPDATE API
        .get(apiRequest)
        .then((response) => {
          const sales = response.data;

          if (sales.length > 0) {
            const data = convertTradesData(sales);
            setTopTradesAll(data);
            debug && console.log(`received top sales -  ${name}`);
          }
        });
    }
  }, [name]);
  useEffect(async () => {
    if (topTradesWeek.length === 0) {
      debug && console.log(`fetching top weekly trades - ${name}`);
      const apiRequest =
        api.topTrades + queries.symbol + name + queries.days + 7;

      const topTradesWeek = await axios.get(apiRequest).then((response) => {
        const trades = response.data;
        if (trades.length > 0) {
          const data = convertTradesData(trades);
          setTopTradesWeek(data);
          debug && console.log(`received top trades -  ${name}`);
        }
      });
    }
  }, [name]);
  useEffect(async () => {
    if (topBuyers.length === 0) {
      debug && console.log(`fetching top buyers - ${name}`);
      const apiRequest =
        api.topTraders +
        queries.symbol +
        name +
        queries.typeBuyers +
        queries.days +
        365 +
        queries.sortVolume;

      const topBuyers = await axios.get(apiRequest).then((response) => {
        const buyers = response.data;
        if (buyers.length > 0) {
          const data = convertTradersData(buyers);
          setTopBuyers(data);
          debug && console.log(`received top buyers - ${name}`);
        }
      });
    }
  }, [name]);
  useEffect(async () => {
    if (topSellers.length === 0) {
      debug && console.log(`fetching top sellers - ${name}`);
      const apiRequest =
        api.topTraders +
        queries.symbol +
        name +
        queries.typeSellers +
        queries.days +
        365 +
        queries.sortVolume;

      const topSellers = await axios.get(apiRequest).then((response) => {
        const sellers = response.data;
        if (sellers.length > 0) {
          const data = convertTradersData(sellers);
          setTopSellers(data);
          debug && console.log(`received top sellers-  ${name}`);
        }
      });
    }
  }, [name]);
  useEffect(async () => {
    if (topNFTsWeek.length === 0) {
      debug && console.log(`fetching top NFTs week - ${name}`);
      const apiRequest =
        api.topNFTs +
        queries.symbol +
        name +
        queries.days +
        7 +
        queries.sortVolume;

      const topSellers = await axios.get(apiRequest).then((response) => {
        const nfts = response.data.splice(0, 4);
        // console.log(nfts);

        if (nfts.length > 0) {
          setTopNFTsWeek(nfts);
          debug && console.log(`received top NFTs week-  ${name}`);
        }
      });
    }
  }, [name]);

  // Calculate Collection Summary Stats
  useEffect(() => {
    if (stats && stats.length > 0) {
      const volumeAllTime = calculateAllTimeVolume(stats);
      setCollectionVolume(volumeAllTime);

      const transactionsAllTime = calculateAllTimeTransactions(stats);
      setCollectionTxCount(transactionsAllTime);

      const averageAllTime = volumeAllTime / transactionsAllTime;
      setCollectionAverage(averageAllTime);
    }
  }, [stats]);

  // Request Collection Floors
  useEffect(() => {
    // Request ME Floor
    const apiRequestME = exchangeApi.magiceden.floor + name;
    const collectionFloorME = axios.get(apiRequestME).then((response) => {
      const floorLamports = response.data;
      if (Object.keys(floorLamports).length > 0) {
        const floor = floorLamports.results.floorPrice * 10e-10;
        setFloorME(floor.toFixed(2));
      }
    });

    // Request SA Floor
    const apiRequestSA = exchangeApi.solanart.floor + name;
    const collectionFloorSA = axios.get(apiRequestSA).then((response) => {
      const floor = response.data.floorPrice;
      if (floor) {
        setFloorSA(floor.toFixed(2));
      }
    });
  }, [name]);
  useEffect(() => {
    if (floorSA !== 0 && floorME !== 0) {
      const floor = Math.min(floorSA, floorME);
      setFloor(floor);
    } else if (floorSA === 0 && floorME !== 0) {
      setFloor(floorME);
    } else if (floorSA !== 0 && floorME === 0) {
      setFloor(floorSA);
    } else setFloor("Unavailable");
  }, [floorSA, floorME]);

  // Split Marketplace Data Structures
  useEffect(() => {
    if (marketplaces > 1 && dailyStats.length > 0) {
      const splitData = splitMarketplaceData(dailyStats);

      const solanartData = getMarketplaceData(splitData.solanart);
      const magicedenData = getMarketplaceData(splitData.magiceden);
      const allMarketplaceData = [];
      if (Object.keys(solanartData).length > 0) {
        allMarketplaceData.push(solanartData);
      }
      if (Object.keys(magicedenData).length > 0) {
        allMarketplaceData.push(magicedenData);
      }

      setMarketplacesData(allMarketplaceData);
    } else if (marketplaces === 1 && dailyStats && dailyStats.length > 0) {
      const allMarketplaceData = [];
      const singleCollectionData = getMarketplaceData(dailyStats);
      allMarketplaceData.push(singleCollectionData);
      setMarketplacesData(allMarketplaceData);
    }
  }, [dailyStats, marketplaces]);

  // Use to build multi-marketplace select
  const toggleMarketplace = (index) => {
    // setSelectedMarketplace(index);
  };

  return (
    <div className="collection_page d-flex flex-column align-items-center col-12">
      <div className="collection_details d-flex flex-wrap col-12 col-lg-8">
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
        </div>
      </div>
      <hr
        style={{ color: "white", width: "50%" }}
        className="mt-lg-5 mt-0 mb-3"
      />

      <h1>Collection Summary</h1>
      <div className="collection_stats d-flex flex-wrap justify-content-around col-10 col-md-6 col-lg-10 mt-lg-3">
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionVolume
              ? collectionVolume.toLocaleString("en", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }) || "Loading..."
              : "Unavailable"}
          </h1>
          <h1 className="collection_info_header">Volume (SOL)</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionTxCount.toLocaleString() || "Loading..."}
          </h1>
          <h1 className="collection_info_header">Transactions</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionAverage ? collectionAverage.toFixed(2) : "Unavailable"}
          </h1>
          <h1 className="collection_info_header">Average (SOL)</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {floor > 0 ? floor + " SOL" : "Unavaialble"}
          </h1>
          <h1 className="collection_info_header">Floor Price</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionInfo.supply
              ? collectionInfo.supply.toLocaleString()
              : "Unavailable"}
          </h1>
          <h1 className="collection_info_header">Supply</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {daysSinceCreated ? daysSinceCreated : "Unavailable"}
          </h1>
          <h1 className="collection_info_header">Days Launched</h1>
        </div>
      </div>
      <hr style={{ color: "white", width: "50%" }} className="mt-4 mb-5" />

      {marketplacesData.length > 0 ? (
        marketplacesData.map((marketplace, i) => {
          return (
            <MarketplaceCharts marketplaceData={marketplace} symbol={name} />
          );
        })
      ) : (
        <div className="mt-5 mb-5 d-flex justify-content-center">
          <Loader />
        </div>
      )}

      <div className="top_tables d-flex flex-wrap justify-content-around col-12">
        <div className="chartbox d-flex flex-column align-items-center col-12 col-lg-10 col-xxl-5 mt-3">
          {" "}
          <h1 className="top_table_header">Top Trades </h1>
          {/* <h5 className="collection_stats_days mb-2">ALL TIME</h5> */}
          <div className="d-flex flex-wrap flex-row justify-content-around col-12 col-sm-10 col-md-6 mb-3">
            <button
              className={`btn_timeframe ${
                timeframeTrades === 7 && "btn_timeframe_selected"
              }`}
              onClick={() => setTimeframeTrades(7)}
            >
              WEEK
            </button>
            <button
              className={`btn_timeframe ${
                timeframeTrades === 1000 && "btn_timeframe_selected"
              }`}
              onClick={() => setTimeframeTrades(1000)}
            >
              ALL TIME
            </button>
          </div>
          <hr style={{ color: "white", width: "100%" }} className="mt-0" />
          {topTradesAll.length !== 0 && topTradesWeek.length !== 0 ? (
            <TradesTable
              data={timeframeTrades === 7 ? topTradesWeek : topTradesAll}
            />
          ) : (
            <div className="col-6">
              <Loader />
            </div>
          )}
        </div>

        <div className="chartbox d-flex flex-column align-items-center col-12 col-lg-10 col-xxl-5 mt-5 mt-lg-3">
          <h1 className="top_table_header">
            Top {traderType === "buyers" ? "Buyers" : "Sellers"}
          </h1>
          <div className="d-flex flex-wrap flex-row justify-content-around col-12 col-sm-10 col-md-6 mb-3">
            <button
              className={`btn_timeframe ${
                traderType === "buyers" && "btn_timeframe_selected"
              }`}
              onClick={() => setTraderType("buyers")}
            >
              BUYERS
            </button>
            <button
              className={`btn_timeframe ${
                traderType === "sellers" && "btn_timeframe_selected"
              }`}
              onClick={() => setTraderType("sellers")}
            >
              SELLERS
            </button>
          </div>
          <hr style={{ color: "white", width: "100%" }} className="mt-0" />
          {topBuyers.length !== 0 && topSellers.length !== 0 ? (
            <TradersTable
              data={traderType === "buyers" ? topBuyers : topSellers}
            />
          ) : (
            <div className="col-6">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
