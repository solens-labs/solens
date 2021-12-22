import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../CollectionStats/style.css";
import "./style.css";
import { useSelector } from "react-redux";
import { selectCollection, selectDebugMode } from "../../redux/app";
import axios from "axios";
import { endpoints } from "../../constants/constants";
import SalesTable from "../SalesTable";
import BuyersTable from "../BuyersSellersTable";
import convertSalesData from "../../utils/convertSalesData";
import convertBuyersSellersData from "../../utils/convertBuyersSellersData";
import {
  calculateAllTimeTransactions,
  calculateLaunchDate,
  getMarketplaceData,
  marketplaceSelect,
  splitMarketplaceData,
} from "../../utils/collectionStats";
import Loader from "../Loader";
import MarketplaceCharts from "../MarketplaceCharts";
import SocialLinks from "../SocialLinks";

export default function CollectionPage(props) {
  const { name } = useParams();
  const collectionData = useSelector(selectCollection);
  const tableLength = 100;
  const debug = useSelector(selectDebugMode);

  const [marketplacesData, setMarketplacesData] = useState([]);
  const [daysSinceCreated, setDaysSinceCreated] = useState(0);
  const [stats, setStats] = useState([]); // needed to populate collection summary
  const [collectionAverage, setCollectionAverage] = useState(0); // needed for collection summar
  const [collectionTxCount, setCollectionTxCount] = useState(0); // needed for collection summary
  const [topSales, setTopSales] = useState([]); // needed for table
  const [topBuyers, setTopBuyers] = useState([]); // needed for table
  const [topSellers, setTopSellers] = useState([]); // needed for table
  const [dailyStats, setDailyStats] = useState([]); // needed to populate charts
  const [collectionInfo, setCollectionInfo] = useState([]); // needed to populate collection data
  const [marketplaces, setMarketplaces] = useState(0);
  const [collectionLinks, setCollectionLinks] = useState({});

  // Fetch daily stats
  useEffect(async () => {
    // console.log(collectionData);

    const dailyStats = await axios
      .get(`${endpoints.api.getDailyStats}` + name)
      .then((response) => {
        const stats = response.data;
        setDailyStats(stats);
      });

    const collectionInfo = await axios
      .get(`${endpoints.api.getCollection}` + name)
      .then((response) => {
        const collectionInfo = response.data[0];
        // console.log(collectionInfo);

        setCollectionInfo(collectionInfo);
        setStats(collectionInfo.alltimestats);
        setMarketplaces(collectionInfo.alltimestats.length);
        setDaysSinceCreated(calculateLaunchDate(collectionInfo));
        // setDailyStats(collectionInfo.dailystats);

        const links = {
          website: collectionInfo.website,
          twitter: collectionInfo.twitter,
          discord: collectionInfo.discord,
        };
        setCollectionLinks(links);
      });
  }, [name]);

  // Split marketplace data structs
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

      // console.log(allMarketplaceData);

      setMarketplacesData(allMarketplaceData);
    } else if (marketplaces === 1 && dailyStats && dailyStats.length > 0) {
      const allMarketplaceData = [];
      const singleCollectionData = getMarketplaceData(dailyStats);
      allMarketplaceData.push(singleCollectionData);
      setMarketplacesData(allMarketplaceData);
    }
  }, [dailyStats, marketplaces]);

  // Fetch All time data (top sales, buyers, sellers)
  useEffect(async () => {
    if (topSales.length === 0) {
      debug && console.log(`fetching top sales - ${name}`);
      const topSales = await axios
        .get(`${endpoints.api.getTopBuys}` + name)
        .then((response) => {
          const sales = response.data;
          if (sales.length > 0) {
            const data = convertSalesData(sales, tableLength);
            setTopSales(data);
            debug && console.log(`received top sales -  ${name}`);
          }
        });
    }
  }, [name]);
  useEffect(async () => {
    if (topBuyers.length === 0) {
      debug && console.log(`fetching top buyers - ${name}`);
      const topBuyers = await axios
        .get(`${endpoints.api.getTopBuyers}` + name)
        .then((response) => {
          const buyers = response.data[0].stats;
          if (buyers.length > 0) {
            const data = convertBuyersSellersData(buyers, tableLength);
            setTopBuyers(data);
            debug && console.log(`received top buyers - ${name}`);
          }
        });
    }
  }, [name]);
  useEffect(async () => {
    if (topSellers.length === 0) {
      debug && console.log(`fetching top sellers - ${name}`);
      const topSellers = await axios
        .get(`${endpoints.api.getTopSellers}` + name)
        .then((response) => {
          const sellers = response.data[0].stats;
          if (sellers.length > 0) {
            const data = convertBuyersSellersData(sellers, tableLength);
            setTopSellers(data);
            debug && console.log(`received top sellers-  ${name}`);
          }
        });
    }
  }, [name]);

  // Calculate All time data figures
  useEffect(() => {
    if (stats && stats.length > 0) {
      const transactionsAllTime = calculateAllTimeTransactions(stats);
      setCollectionTxCount(transactionsAllTime);

      const averageAllTime = collectionInfo.total_volume / transactionsAllTime;
      setCollectionAverage(averageAllTime);
    }
  }, [stats]);

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
            {collectionInfo.total_volume
              ? collectionInfo.total_volume.toLocaleString("en", {
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
        <div className="collection_stat">
          <h1 className="collection_info">
            {stats
              ? marketplaces === 1
                ? marketplaceSelect(stats[0].marketplace)
                : marketplaces
              : "Unavailable"}
          </h1>
          <h1 className="collection_info_header">
            {stats && marketplaces > 1 ? "Marketplaces" : "Marketplace"}
          </h1>
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

      <div className="top_tables d-flex flex-wrap flex-column align-items-center col-12">
        <div className="chartbox d-flex flex-column align-items-center col-12 col-md-6">
          {" "}
          <h1>Top {topSales.length || ""} Sales</h1>
          <hr style={{ color: "white", width: "100%" }} className="mt-0" />
          {topSales.length !== 0 ? (
            <SalesTable data={topSales} />
          ) : (
            <div className="col-6">
              <Loader />
            </div>
          )}
        </div>
        <div className="d-flex flex-wrap justify-content-around col-12">
          <div className="chartbox d-flex flex-column align-items-center col-12 col-md-5 mt-5">
            <h1>Top {topBuyers.length || ""} Buyers</h1>
            <hr style={{ color: "white", width: "100%" }} className="mt-0" />
            {topBuyers.length !== 0 ? (
              <BuyersTable data={topBuyers} />
            ) : (
              <div className="col-6">
                <Loader />
              </div>
            )}
          </div>
          <div className="chartbox d-flex flex-column align-items-center col-12 col-md-5 mt-5">
            <h1>Top {topSellers.length || ""} Sellers</h1>
            <hr style={{ color: "white", width: "100%" }} className="mt-0" />
            {topSellers.length !== 0 ? (
              <BuyersTable data={topSellers} />
            ) : (
              <div className="col-6">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
