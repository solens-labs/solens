import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../components/CollectionStats/style.css";
import "./style.css";
import { useSelector } from "react-redux";
import { selectCollection, selectDebugMode } from "../../redux/app";
import axios from "axios";
import {
  api,
  exchangeApi,
  explorerLink,
  lineColors,
  queries,
} from "../../constants/constants";
import TradesTable from "../../components/TradesTable";
import TradersTable from "../../components/TradersTable";
import convertTradesData from "../../utils/convertTradesData";
import convertTradersData from "../../utils/convertTradersData";
import {
  calculateAllTimeTransactions,
  calculateAllTimeVolume,
  calculateLaunchDate,
  getMarketplaceData,
  marketplaceSelect,
  splitMarketplaceData,
} from "../../utils/collectionStats";
import Loader from "../../components/Loader";
import MarketplaceCharts from "../../components/MarketplaceCharts";
import SocialLinks from "../../components/SocialLinks";
import { getTokenMetadata } from "../../utils/getMetadata";
import { convertFloorData } from "../../utils/convertFloorData";
import LineChart from "../../components/LineChart";
import Timeframe from "../../components/Timeframe";

export default function CollectionPage(props) {
  const { name } = useParams();
  const debug = useSelector(selectDebugMode);

  const [timeframeFloor, setTimeframeFloor] = useState(30); // default timeframe for historical floor chart
  const [timeframeTrades, setTimeframeTrades] = useState(1000); // default timeframe for top trades table
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
  const [topTradesDay, setTopTradesDay] = useState([]); // needed for table
  const [topBuyers, setTopBuyers] = useState([]); // needed for table
  const [topSellers, setTopSellers] = useState([]); // needed for table
  const [topNFTsWeek, setTopNFTsWeek] = useState([]); // needed for section
  const [dailyStats, setDailyStats] = useState([]); // needed to populate charts
  const [marketplaces, setMarketplaces] = useState(0); // needed to figure out how many datasets to show
  const [collectionLinks, setCollectionLinks] = useState({});
  const [floor, setFloor] = useState(0); // needed for collection summary
  const [floorME, setFloorME] = useState(0); // needed for MP summary
  const [floorSA, setFloorSA] = useState(0); // needed for MP summary
  const [floorChart, setFloorChart] = useState([]); // needed for historical floor chart
  const [floor2W, setFloor2W] = useState([]); // needed for historical floor chart
  const [floor1M, setFloor1M] = useState([]); // needed for historical floor chart
  const [floorAll, setFloorAll] = useState([]); // needed for historical floor chart
  const [topFour, setTopFour] = useState([]); // needed to show top 3 NFTs
  const [topFourMetadata, setTopFourMetadata] = useState([]);

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

      const topTradesAll = await axios.get(apiRequest).then((response) => {
        const sales = response.data;

        if (sales.length > 0) {
          // set top sales to display
          const topFourSales = sales.slice(0, 4);
          setTopFour(topFourSales);

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
    if (topTradesDay.length === 0) {
      debug && console.log(`fetching top weekly trades - ${name}`);
      const apiRequest =
        api.topTrades + queries.symbol + name + queries.days + 1;

      const topTradesDay = await axios.get(apiRequest).then((response) => {
        const trades = response.data;
        if (trades.length > 0) {
          const data = convertTradesData(trades);
          setTopTradesDay(data);
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

  // Fetch Historical Floor
  useEffect(async () => {
    if (floor2W.length === 0) {
      const apiRequest = api.floor + queries.symbol + name + queries.days + 14;
      const historicalFloor = await axios.get(apiRequest).then((response) => {
        const floor = response.data;

        const floorData = convertFloorData(floor);
        setFloor2W(floorData);
        setFloor(floorData.floorsArray.at(-1));

        const split = splitMarketplaceData(floor);
        if (split["magiceden"] && split["magiceden"].length > 0) {
          const floorME = split["magiceden"][0].floor;
          setFloorME(floorME);
        }
        if (split["solanart"] && split["solanart"].length > 0) {
          const floorSA = split["solanart"][0].floor;
          setFloorSA(floorSA);
        }
      });
    }

    if (floor1M.length === 0) {
      const apiRequest = api.floor + queries.symbol + name + queries.days + 30;
      const historicalFloor = await axios.get(apiRequest).then((response) => {
        const floor = response.data;
        const floorData = convertFloorData(floor);
        setFloor1M(floorData);
      });
    }

    if (floorAll.length === 0) {
      const apiRequest = api.floor + queries.symbol + name + queries.days + 365;
      const historicalFloor = await axios.get(apiRequest).then((response) => {
        const floor = response.data;
        const floorData = convertFloorData(floor);
        setFloorAll(floorData);
      });
    }
  }, [name]);

  useEffect(() => {
    switch (timeframeFloor) {
      case 14:
        setFloorChart(floor2W);
        break;
      case 30:
        setFloorChart(floor1M);
        break;
      case 1000:
        setFloorChart(floorAll);
        break;
    }
  }, [floor1M, timeframeFloor]);

  // Add multiple MP floor data for line chart to component MP data
  // useEffect(() => {
  //   if (
  //     floorChart.length !== 0 &&
  //     marketplacesData.length !== 0 &&
  //     !marketplacesData[0].floorsArray
  //   ) {
  //     const combinedMarketplaceData = marketplacesData;
  //     combinedMarketplaceData[0]["floorDates"] = floorChart.datesArray;
  //     combinedMarketplaceData[0]["floorsArray"] = floorChart.floorsArray;
  //     // const newMarketplacesData = [combinedMarketplaceData[0]];
  //     setMarketplacesData(combinedMarketplaceData);
  //   }
  // }, [floorChart, marketplacesData]);

  // Toggle Top Trades Timeframe

  const topTradesTimeframe = () => {
    switch (timeframeTrades) {
      case 1:
        return topTradesDay;
        break;
      case 7:
        return topTradesWeek;
        break;
      case 1000:
        return topTradesAll;
        break;
    }
  };

  // Get Top 4 NFT Sales Metadata
  useEffect(async () => {
    if (topFourMetadata.length === 0 && topFour.length !== 0) {
      const topFourMetadataPull = topFour.map(async (token, i) => {
        const tokenMetadata = await getTokenMetadata(token.mint);
        tokenMetadata["price"] = topFour[i].price;
        const date = new Date(topFour[i].date);
        tokenMetadata["date"] = date.toLocaleDateString();

        return tokenMetadata;
      });

      const resolved = await Promise.all(topFourMetadataPull);
      setTopFourMetadata(resolved);
    }
  }, [topFour]);

  return (
    <div className="collection_page d-flex flex-column align-items-center col-12">
      <div className="collection_details d-flex flex-wrap col-12 col-lg-8 mb-3 mb-lg-5">
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

      {/* <hr
        style={{ color: "white", width: "50%" }}
        className="mt-lg-5 mt-0 mb-3"
      /> */}
      <h1 className="mt-lg-3">Collection Summary</h1>
      <div className="collection_stats d-flex flex-wrap justify-content-around col-10 col-md-6 col-lg-10 mt-lg-3">
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionVolume
              ? collectionVolume.toLocaleString("en", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : "Loading..."}
          </h1>
          <h1 className="collection_info_header">Volume (SOL)</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionTxCount
              ? collectionTxCount.toLocaleString()
              : "Loading..."}
          </h1>
          <h1 className="collection_info_header">Transactions</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionAverage ? collectionAverage.toFixed(2) : "Loading..."}
          </h1>
          <h1 className="collection_info_header">Average (SOL)</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {floor > 0 ? floor : "Loading..."}
          </h1>
          <h1 className="collection_info_header">Floor Price (SOL)</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {collectionInfo.supply
              ? collectionInfo.supply.toLocaleString()
              : "Loading..."}
          </h1>
          <h1 className="collection_info_header">Supply</h1>
        </div>
        <div className="collection_stat">
          <h1 className="collection_info">
            {daysSinceCreated ? daysSinceCreated : "Loading..."}
          </h1>
          <h1 className="collection_info_header">Days Launched</h1>
        </div>
      </div>

      <div className="collection_floor chartbox d-flex flex-column align-items-center col-12 col-md-6 col-lg-10 mt-5">
        <h2>Historical Floor</h2>
        {floorChart && floorChart.length !== 0 ? (
          <>
            <div className="col-12 col-sm-8 col-md-4 mt-2 mb-3">
              <Timeframe
                currentTimeframe={timeframeFloor}
                setTimeframe={setTimeframeFloor}
                timeframes={["2W", "1M", "ALL TIME"]}
                intervals={[14, 30, 1000]}
              />
            </div>
            <LineChart
              dates={floorChart.datesArray}
              // legend={["SOL"]}
              dataset={[floorChart.floorsArray]}
              color={lineColors[2]}
              tension={0.5}
            />
          </>
        ) : (
          <div className="h-100 d-flex align-items-center">
            <Loader />
          </div>
        )}
      </div>

      <hr style={{ color: "white", width: "50%" }} className="mt-4 mb-4" />

      <h1 className="mt-4">Top Sales</h1>
      <div className="collection_stats d-flex flex-wrap justify-content-around col-10 col-md-6 col-lg-10 mt-lg-3 mb-4">
        {topFourMetadata.length === 4 ? (
          topFourMetadata.map((token, i) => {
            return (
              <a
                href={explorerLink("token", token.mint)}
                target="_blank"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="nft_card_sale d-flex flex-column justify-content-between mt-4 mt-lg-0">
                  <img
                    src={topFourMetadata[i].image}
                    className="nft_card_image"
                    alt="nft_card"
                  />

                  <div className="d-flex flex-column align-items-center justify-content-around pb-2">
                    <h5>{topFourMetadata[i].name}</h5>

                    <div className="d-flex flex-row col-10 justify-content-between p-2 pt-0 pb-0">
                      <h5>{topFourMetadata[i].price} SOL</h5>
                      <h5>{topFourMetadata[i].date}</h5>
                    </div>
                  </div>
                </div>
              </a>
            );
          })
        ) : (
          <Loader />
        )}
      </div>

      <hr style={{ color: "white", width: "50%" }} className="mt-4 mb-5" />

      <>
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
      </>

      <div className="top_tables d-flex flex-wrap justify-content-around col-12">
        <div className="chartbox d-flex flex-column align-items-center col-12 col-lg-10 col-xxl-5 mt-3">
          {" "}
          <h1 className="top_table_header">Top Trades </h1>
          <div className="col-12 col-sm-10 col-md-6 mb-3">
            <Timeframe
              currentTimeframe={timeframeTrades}
              setTimeframe={setTimeframeTrades}
              timeframes={["24H", "7D", "ALL TIME"]}
              intervals={[1, 7, 1000]}
            />
          </div>
          <hr style={{ color: "white", width: "100%" }} className="mt-0" />
          {topTradesAll.length !== 0 &&
          topTradesWeek.length !== 0 &&
          topTradesDay !== 0 ? (
            <TradesTable data={topTradesTimeframe()} />
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
