import { useEffect, useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import "../../components/CollectionStat/style.css";
import "./style.css";
import { useSelector } from "react-redux";
import {
  selectAllCollections,
  selectCollection,
  selectDebugMode,
  selectSolPrice,
} from "../../redux/app";
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
  compareVolume,
} from "../../utils/collectionStats";
import {
  calculateStats,
  fetchCollection,
  fetchFloors,
  fetchHistoricalFloor,
  fetchTopFourMetadata,
  fetchTopTraders,
  fetchTopTrades,
  handleMpsData,
  splitMarketplaceData,
} from "./utils";
import Loader from "../../components/Loader";
import MarketplaceCharts from "../../components/MarketplaceCharts";
import SocialLinks from "../../components/SocialLinks";
import { getTokenMetadata } from "../../utils/getMetadata";
import { convertFloorData } from "../../utils/convertFloorData";
import LineChart from "../../components/LineChart";
import Timeframe from "../../components/Timeframe";
import sol_logo from "../../assets/images/sol_logo.png";
import CollectionStat from "../../components/CollectionStat";

export default function CollectionPage(props) {
  const { name } = useParams();
  const debug = useSelector(selectDebugMode);
  const allCollections = useSelector(selectAllCollections);
  const solPrice = useSelector(selectSolPrice);

  const [timeframeFloor, setTimeframeFloor] = useState(30); // default timeframe for historical floor chart
  const [timeframeTrades, setTimeframeTrades] = useState(1000); // default timeframe for top trades table
  const [traderType, setTraderType] = useState("buyers");

  const [marketplacesData, setMarketplacesData] = useState([]); // needed for each MP's charts
  const [daysSinceCreated, setDaysSinceCreated] = useState(0); // needed for days launched
  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [collectionVolume, setCollectionVolume] = useState(0); // needed for collection summary
  const [collectionAverage, setCollectionAverage] = useState(0); // needed for collection summary
  const [collectionTxCount, setCollectionTxCount] = useState(0); // needed for collection summary
  const [collectionMarketCap, setCollectionMarketCap] = useState(0); //needed for collection summary
  const [stats, setStats] = useState([]); // needed to populate collection summary
  const [topTradesAll, setTopTradesAll] = useState([]); // needed for table
  const [topTradesWeek, setTopTradesWeek] = useState([]); // needed for table
  const [topTradesDay, setTopTradesDay] = useState([]); // needed for table
  const [topBuyers, setTopBuyers] = useState([]); // needed for table
  const [topSellers, setTopSellers] = useState([]); // needed for table
  const [dailyStats, setDailyStats] = useState([]); // needed to populate charts
  const [marketplaces, setMarketplaces] = useState(0); // needed to figure out how many datasets to show
  const [collectionLinks, setCollectionLinks] = useState({});
  const [floor, setFloor] = useState(0); // needed for collection summary
  const [floorME, setFloorME] = useState(0); // needed for MP summary
  const [floorSA, setFloorSA] = useState(0); // needed for MP summary
  const [floorSMB, setFloorSMB] = useState(0); // needed for MP summary
  const [floorChart, setFloorChart] = useState([]); // needed for historical floor chart
  const [floor2W, setFloor2W] = useState([]); // needed for historical floor chart
  const [floor1M, setFloor1M] = useState([]); // needed for historical floor chart
  const [floorAll, setFloorAll] = useState([]); // needed for historical floor chart
  const [topFour, setTopFour] = useState([]); // needed to show top sales section
  const [topFourMetadata, setTopFourMetadata] = useState([]);
  const [noCollection, setNoCollection] = useState(false); //redirect user on incorrect symbol

  // Fetch Collection Data
  useEffect(() => {
    if (name && allCollections?.length > 0) {
      const fetchCollectionData = async (symbol) => {
        let collectionInfo = await fetchCollection(name, allCollections);
        if (!collectionInfo) {
          setNoCollection(true);
          return;
        }
        setCollectionInfo(collectionInfo);
        setStats(collectionInfo?.alltimestats);
        setMarketplaces(collectionInfo?.alltimestats?.length);
        setDaysSinceCreated(calculateLaunchDate(collectionInfo));
        setDailyStats(collectionInfo?.dailystats);
        setCollectionLinks(collectionInfo?.links);
      };
      fetchCollectionData(name);
    }
  }, [name, allCollections]);

  // Calculate Market Cap
  useEffect(() => {
    if (floor > 0 && collectionInfo?.supply > 0 && solPrice > 0) {
      const marketCap = floor * collectionInfo.supply * solPrice;
      const marketCapFormatted = marketCap.toLocaleString("en", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      setCollectionMarketCap(marketCapFormatted);
    }
  }, [solPrice, floor, collectionInfo]);

  // Fetch Top Trades All-Time
  useEffect(() => {
    if (topTradesAll.length === 0) {
      const fetchTopTradesData = async (symbol) => {
        let response = await fetchTopTrades(365, symbol);
        response && setTopTradesAll(response);
        response && setTopFour(response.slice(0, 4));
      };
      fetchTopTradesData(name);
    }
  }, [name]);

  // Fetch Top Trades Week
  useEffect(() => {
    if (topTradesWeek.length === 0) {
      const fetchTopTradesData = async (symbol) => {
        let response = await fetchTopTrades(7, symbol);
        setTopTradesWeek(response);
      };
      fetchTopTradesData(name);
    }
  }, [name]);

  // Fetch Top Trades Day
  useEffect(() => {
    if (topTradesDay.length === 0) {
      const fetchTopTradesData = async (symbol) => {
        let response = await fetchTopTrades(1, symbol);
        setTopTradesDay(response);
      };
      fetchTopTradesData(name);
    }
  }, [name]);

  // Fetch Top Buyers
  useEffect(() => {
    if (topBuyers.length === 0) {
      const fetchTopBuyers = async (symbol) => {
        let response = await fetchTopTraders("buyers", symbol);
        setTopBuyers(response);
      };
      fetchTopBuyers(name);
    }
  }, [name]);

  // Fetch Top Sellers
  useEffect(() => {
    if (topSellers.length === 0) {
      const fetchTopSellers = async (symbol) => {
        let response = await fetchTopTraders("sellers", symbol);
        setTopSellers(response);
      };
      fetchTopSellers(name);
    }
  }, [name]);

  // Calculate Collection Summary Stats
  useEffect(() => {
    const collectionStats = (stats) => {
      const response = calculateStats(stats);
      setCollectionVolume(response.volumeAllTime);
      setCollectionTxCount(response.transactionsAllTime);
      setCollectionAverage(response.averageAllTime);
    };
    stats?.length > 0 && collectionStats(stats);
  }, [stats]);

  // Fetch & Set Floors
  useEffect(() => {
    const floor = async (symbol) => {
      let response = await fetchFloors(symbol);
      setFloor(response?.floor);
      setFloorME(response?.magicedn);
      setFloorSA(response?.solanart);
      setFloorSMB(response?.smb);
    };
    floor(name);
  }, [name]);

  // Split Marketplace Data & Set
  useEffect(() => {
    if (marketplaces && dailyStats?.length > 0) {
      const marketplacesData = handleMpsData(dailyStats, marketplaces);
      setMarketplacesData(marketplacesData);
    }
  }, [dailyStats, marketplaces]);

  // Fetch Historical Floor
  useEffect(() => {
    const historicalFloor = async (symbol) => {
      let response = await fetchHistoricalFloor(name);
      setFloor2W(response?.twoWeeks);
      setFloor1M(response?.oneMonth);
      setFloorAll(response?.allTime);
    };
    historicalFloor(name);
  }, [name]);

  // Toggle Historical Floor Timeframe
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

  // Get Top 4 NFT Sales Metadata
  useEffect(() => {
    if (topFourMetadata?.length === 0 && topFour?.length !== 0) {
      const topFourMD = async (topFour) => {
        const response = await fetchTopFourMetadata(topFour);
        setTopFourMetadata(response);
      };
      topFourMD(topFour);
    }
  }, [topFour]);

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

  return (
    <div className="collection_page d-flex flex-column align-items-center col-12 mt-4 mt-lg-5">
      {noCollection && <Redirect to="/" />}

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
          {collectionInfo.name ? (
            <h1 className="collection_name_large">{collectionInfo.name}</h1>
          ) : (
            <Loader />
          )}
          {collectionLinks.website ||
          collectionLinks.twitter ||
          collectionLinks.discord ? (
            <SocialLinks links={collectionLinks} />
          ) : (
            ""
          )}
          <p className="collection_description">{collectionInfo.description}</p>
          <Link to={`/nfts/${name}`} style={{ textDecoration: "none" }}>
            <div className="col-12 btn-button btn-main btn-large d-flex mt-2 mb-2">
              Trade
            </div>
          </Link>
        </div>
      </div>

      <h1 className="mt-0 mt-xxl-3">Collection Summary</h1>
      <div className="collection_stats d-flex flex-wrap justify-content-around col-12 col-xxl-10 p-lg-2 pt-lg-0 pb-lg-0 mt-lg-3">
        <CollectionStat
          stat={collectionMarketCap ? `$${collectionMarketCap}` : "Loading..."}
          label={"Market Cap"}
        />
        <CollectionStat
          stat={floor > 0 ? floor : "Loading..."}
          label={"Floor (SOL)"}
        />
        <CollectionStat
          stat={
            collectionVolume
              ? collectionVolume.toLocaleString("en", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              : "Loading..."
          }
          label={"Volume (SOL)"}
        />
        <CollectionStat
          stat={
            collectionTxCount
              ? collectionTxCount.toLocaleString()
              : "Loading..."
          }
          label={"Transactions"}
        />
        <CollectionStat
          stat={collectionAverage ? collectionAverage.toFixed(2) : "Loading..."}
          label={"Average (SOL)"}
        />
        <CollectionStat
          stat={
            collectionInfo.supply
              ? collectionInfo.supply.toLocaleString()
              : "Loading..."
          }
          label={"Supply"}
        />
        {/* <CollectionStat
          stat={daysSinceCreated ? daysSinceCreated : "Loading..."}
          label={"Days Launched"}
        /> */}
      </div>

      <div className="collection_floor chartbox d-flex flex-column align-items-center col-12 col-lg-10 mt-5">
        <h2>Historical Floor</h2>
        {floorChart && floorChart?.length !== 0 ? (
          <>
            <div className="col-12 col-sm-10 col-md-8 col-xl-6 col-xxl-4 mt-2 mb-3">
              <Timeframe
                currentTimeframe={timeframeFloor}
                setTimeframe={setTimeframeFloor}
                timeframes={["2W", "1M", "ALL"]}
                intervals={[14, 30, 1000]}
              />
            </div>
            <LineChart
              dates={floorChart.datesArray}
              // legend={["SOL"]}
              dataset={[floorChart.floorsArray]}
              color={lineColors[2]}
              tension={0.5}
              pointRadius={timeframeFloor === 1000 ? 3 : 5}
            />
          </>
        ) : (
          <div className="h-100 d-flex align-items-center">
            <Loader />
          </div>
        )}
      </div>

      <hr style={{ color: "white", width: "50%" }} className="mt-4 mb-3" />

      <h1 className="mt-4">Top Sales</h1>
      <div className="d-flex flex-column align-items-center col-12 col-xl-10 mt-lg-3 mb-4">
        <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
          {topFourMetadata?.length === 4 ? (
            topFourMetadata.map((token, i) => {
              return (
                <div className="nft_card_container col-12 col-sm-8 col-md-6 col-lg-5 col-xxl-3 mb-4 p-2 pb-0 pt-0">
                  <a
                    href={`/mint/${token.mint}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <div className="nft_card d-flex flex-column align-items-center">
                      <img
                        src={topFourMetadata[i].image}
                        className="nft_card_image"
                        alt="nft_card"
                      />

                      <div className="nft_card_details_home d-flex align-items-center">
                        <div className="col-12">
                          <h5>{topFourMetadata[i].name}</h5>

                          <div className="d-flex flex-row col-12 justify-content-around">
                            <h5>
                              <img
                                src={sol_logo}
                                alt="sol logo"
                                className="price_logo_sm"
                              />
                              {topFourMetadata[i].price}
                            </h5>
                            <h5>{topFourMetadata[i].date}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })
          ) : (
            <Loader />
          )}
        </div>

        <Link to={`/nfts/${name}`} style={{ textDecoration: "none" }}>
          <div className="col-12 btn-button btn-main btn-large d-flex mt-2">
            View All NFTs
          </div>
        </Link>
      </div>

      <hr style={{ color: "white", width: "50%" }} className="mt-4 mb-5" />

      <>
        {marketplacesData?.length > 0 ? (
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
        <div className="chartbox d-flex flex-column align-items-center col-12 col-lg-10 col-xl-8 col-xxl-5 mt-3">
          {" "}
          <h1 className="top_table_header">Top Trades </h1>
          <div className="col-12 col-sm-10 col-md-8 col-xxl-7 mb-3">
            <Timeframe
              currentTimeframe={timeframeTrades}
              setTimeframe={setTimeframeTrades}
              timeframes={["24H", "7D", "ALL"]}
              intervals={[1, 7, 1000]}
            />
          </div>
          <hr style={{ color: "white", width: "100%" }} className="mt-0" />
          {topTradesAll?.length !== 0 &&
          topTradesWeek?.length !== 0 &&
          topTradesDay?.length !== 0 ? (
            <TradesTable data={topTradesTimeframe()} />
          ) : (
            <div className="col-6">
              <Loader />
            </div>
          )}
        </div>

        <div className="chartbox d-flex flex-column align-items-center col-12 col-lg-10 col-xl-8 col-xxl-5 mt-5 mt-lg-3">
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
          {topBuyers?.length !== 0 && topSellers?.length !== 0 ? (
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
