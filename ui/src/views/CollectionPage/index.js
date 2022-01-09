import { useEffect, useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import "../../components/CollectionStat/style.css";
import "./style.css";
import { useSelector } from "react-redux";
import {
  selectAllCollections,
  selectCollection,
  selectDebugMode,
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
  splitMarketplaceData,
  compareVolume,
} from "../../utils/collectionStats";
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
  const [topFour, setTopFour] = useState([]); // needed to show top sales section
  const [topFourMetadata, setTopFourMetadata] = useState([]);
  const [noCollection, setNoCollection] = useState(false); //redirect user on incorrect symbol

  // Fetch Collection Data
  useEffect(async () => {
    if (allCollections.length > 0) {
      const filterCheck = allCollections.filter((item) => item.symbol === name);
      const result = filterCheck.length > 0;
      if (!result) {
        setNoCollection(true);
        return;
      }

      if (result) {
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
      }
    }
  }, [name, allCollections]);

  // Fetch Top Trades All-Time
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
  // Fetch Top Trades Week
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
  // Fetch Top Trades Day
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
  // Fetch Top Buyers
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
  // Fetch Top Sellers
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

  // Fetch floors from MPs
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

    // Request SMB Floor
    if (name === "solana_monkey_business") {
      const apiRequestSMB = exchangeApi.smb.items;
      const collectionFloorSMB = axios.get(apiRequestSMB).then((response) => {
        const fullSMBData = response.data.items;
        const listed = fullSMBData.filter((item) => {
          if (item.price && item.price > 0) {
            return item.price;
          }
        });
        const prices = listed.map((item) => {
          return item.price / 1000000000;
        });
        const smbFloor = Math.min(...prices);
        setFloor(smbFloor.toFixed(2));
      });
    }
  }, [name]);
  // Determine absolute floor
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

      const smbData = getMarketplaceData(splitData.smb);
      const solanartData = getMarketplaceData(splitData.solanart);
      const magicedenData = getMarketplaceData(splitData.magiceden);

      const allMarketplaceData = [];
      smbData && allMarketplaceData.push(smbData);
      solanartData && allMarketplaceData.push(solanartData);
      magicedenData && allMarketplaceData.push(magicedenData);

      allMarketplaceData.sort(compareVolume);
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

        // const currentFloor = floor[floor.length - 1].floor.toFixed(2);
        // setFloor(currentFloor);

        if (floor.length > 0) {
          const floorData = convertFloorData(floor);
          setFloor2W(floorData);

          const split = splitMarketplaceData(floor);
          if (split["magiceden"] && split["magiceden"].length > 0) {
            const floorME = split["magiceden"][0].floor;
            setFloorME(floorME);
          }
          if (split["solanart"] && split["solanart"].length > 0) {
            const floorSA = split["solanart"][0].floor;
            setFloorSA(floorSA);
          }
        }
      });
    }

    if (floor1M.length === 0) {
      const apiRequest = api.floor + queries.symbol + name + queries.days + 30;
      const historicalFloor = await axios.get(apiRequest).then((response) => {
        const floor = response.data;
        if (floor.length > 0) {
          const floorData = convertFloorData(floor);
          setFloor1M(floorData);
        }
      });
    }

    if (floorAll.length === 0) {
      const apiRequest = api.floor + queries.symbol + name + queries.days + 365;
      const historicalFloor = await axios.get(apiRequest).then((response) => {
        const floor = response.data;
        if (floor.length > 0) {
          const floorData = convertFloorData(floor);
          setFloorAll(floorData);
        }
      });
    }
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
              View NFTs
            </div>
          </Link>
        </div>
      </div>

      {/* <hr
        style={{ color: "white", width: "50%" }}
        className="mt-lg-5 mt-0 mb-3"
      /> */}
      <h1 className="mt-0 mt-xxl-3">Collection Summary</h1>
      <div className="collection_stats d-flex flex-wrap justify-content-around col-12 col-xxl-10 p-lg-2 pt-lg-0 pb-lg-0 mt-lg-3">
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
          stat={floor > 0 ? floor : "Loading..."}
          label={"Floor (SOL)"}
        />
        <CollectionStat
          stat={
            collectionInfo.supply
              ? collectionInfo.supply.toLocaleString()
              : "Loading..."
          }
          label={"Supply"}
        />
        <CollectionStat
          stat={daysSinceCreated ? daysSinceCreated : "Loading..."}
          label={"Days Launched"}
        />
      </div>

      <div className="collection_floor chartbox d-flex flex-column align-items-center col-12 col-lg-10 mt-5">
        <h2>Historical Floor</h2>
        {floorChart && floorChart.length !== 0 ? (
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
          {topFourMetadata.length === 4 ? (
            topFourMetadata.map((token, i) => {
              return (
                <div className="nft_card_container col-12 col-sm-8 col-md-6 col-lg-5 col-xxl-3 mb-4 p-2 pb-0 pt-0">
                  <a
                    href={explorerLink("token", token.mint)}
                    target="_blank"
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
