import axios from "axios";
import { api, queries } from "../../constants/constants";
import {
  getMarketplaceData,
  compareVolume,
  splitMarketplaceData,
  calculateAllTimeVolume,
  calculateAllTimeTransactions,
} from "../../utils/collectionStats";
import { convertFloorData } from "../../utils/convertFloorData";
import convertTradersData from "../../utils/convertTradersData";
import convertTradesData from "../../utils/convertTradesData";
import { getTokenMetadata } from "../../utils/getMetadata";

// Fetch Collection Data
export const fetchCollection = async (symbol, allCollections) => {
  const filterCheck = allCollections.filter((item) => item.symbol === symbol);
  const result = filterCheck.length > 0;
  if (!result) {
    return;
  }

  if (result) {
    const apiRequest = api.server.collection + queries.symbol + symbol;
    const collectionInfo = await axios
      .get(apiRequest)
      .then((response) => {
        const collectionInfo = response.data[0];
        collectionInfo["links"] = {
          website: collectionInfo?.website,
          twitter: collectionInfo?.twitter,
          discord: collectionInfo?.discord,
        };
        return collectionInfo;
      })
      .catch((e) => {
        console.log("Error fetching Collection Data.");
      });
    return collectionInfo;
  }
};

// Split daily stats data by marketplace
export const handleMpsData = (dailyStats, marketplaces) => {
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
    return allMarketplaceData;
  } else if (marketplaces === 1 && dailyStats?.length > 0) {
    const allMarketplaceData = [];
    const singleCollectionData = getMarketplaceData(dailyStats);
    allMarketplaceData.push(singleCollectionData);
    return allMarketplaceData;
  } else {
    console.log("Error splitting marketplace data.");
  }
};

// Fetch current floors and split by MP
export const fetchFloors = async (symbol) => {
  const apiRequest = api.server.currentFloor + queries.symbol + symbol;
  const currentFloors = await axios
    .get(apiRequest)
    .then((response) => {
      const allFloors = response.data;
      const floors = {};

      allFloors.sort((a, b) => {
        return a.floor - b.floor;
      });
      const absoluteFloor = allFloors[0].floor;
      floors["floor"] = absoluteFloor;

      const meFloor = allFloors.filter((item) => {
        if (item.marketplace === "magiceden") {
          floors["magiceden"] = item.floor;
        }
      });
      const saFloor = allFloors.filter((item) => {
        if (item.marketplace === "solanart") {
          floors["solanart"] = item.floor;
        }
      });
      const smbFloor = allFloors.filter((item) => {
        if (item.marketplace === "smb") {
          floors["smb"] = item.floor;
        }
      });

      return floors;
    })
    .catch((e) => {
      console.log(`Error fetching floor data.`);
    });
  return currentFloors;
};

// Calculate Collection Summary Stats
export const calculateStats = (data) => {
  if (data?.length > 0) {
    const volumeAllTime = calculateAllTimeVolume(data);
    const transactionsAllTime = calculateAllTimeTransactions(data);
    const averageAllTime = volumeAllTime / transactionsAllTime;
    return {
      volumeAllTime: volumeAllTime,
      transactionsAllTime: transactionsAllTime,
      averageAllTime: averageAllTime,
    };
  } else {
    console.log("Error calculating collection stats. No data received.");
  }
};

// Collection - Fetch Top Traders API
export const fetchTopTraders = async (type, symbol) => {
  let traderType = "";

  switch (type) {
    case "sellers":
      traderType = "typeSellers";
      break;
    case "buyers":
      traderType = "typeBuyers";
      break;
  }

  const apiRequest =
    api.server.topTraders +
    queries.symbol +
    symbol +
    queries[traderType] +
    queries.allTime +
    true +
    queries.sortVolume;

  //   console.log(apiRequest);

  const topTraders = await axios
    .get(apiRequest)
    .then((response) => {
      const topTradersData = response.data;
      if (topTradersData?.length > 0) {
        const data = convertTradersData(topTradersData);
        return data;
      }
    })
    .catch((e) => {
      console.log(`Error fetching top ${type}.`);
    });

  return topTraders;
};

// Fetch Top Trades API
export const fetchTopTrades = async (timeframe, symbol) => {
  const apiRequest =
    api.server.topNFTs + queries.symbol + symbol + queries.days + timeframe;

  const topTrades = await axios
    .get(apiRequest)
    .then((response) => {
      const trades = response.data;
      if (trades.length > 0) {
        const data = convertTradesData(trades);
        return data;
      }
    })
    .catch((e) => {
      console.log(`Error fetching top trades for ${timeframe}.`);
    });

  return topTrades;
};
// Fetch Historical Floor API
export const fetchHistoricalFloor = async (symbol) => {
  const apiRequest2W =
    api.server.floor + queries.symbol + symbol + queries.days + 14;
  const historicalFloor2W = await axios
    .get(apiRequest2W)
    .then((response) => {
      const floorData = response.data;
      if (floorData.length > 0) {
        const floor = convertFloorData(floorData);
        return floor;
      }
    })
    .catch((e) => {
      console.log("Error fetching Historical 2W Floor");
    });

  const apiRequest1M =
    api.server.floor + queries.symbol + symbol + queries.days + 30;
  const historicalFloor1M = await axios
    .get(apiRequest1M)
    .then((response) => {
      const floorData = response.data;
      if (floorData.length > 0) {
        const floor = convertFloorData(floorData);
        return floor;
      }
    })
    .catch((e) => {
      console.log("Error fetching Historical 1M Floor");
    });

  const apiRequestAll =
    api.server.floor + queries.symbol + symbol + queries.days + 365;
  const historicalFloorAll = await axios
    .get(apiRequestAll)
    .then((response) => {
      const floorData = response.data;
      if (floorData.length > 0) {
        const floor = convertFloorData(floorData);
        return floor;
      }
    })
    .catch((e) => {
      console.log("Error fetching Historical All Time Floor");
    });

  return {
    twoWeeks: historicalFloor2W,
    oneMonth: historicalFloor1M,
    allTime: historicalFloorAll,
  };
};

// Fetch the metadata for top four trades
export const fetchTopFourMetadata = async (topFour) => {
  const topFourMetadataPull = topFour.map(async (token, i) => {
    const mintAddressObject = token.address.props.href;
    const objectLength = mintAddressObject?.length;
    const mintAddress = mintAddressObject.slice(6, objectLength);

    const tokenMetadata = await getTokenMetadata(mintAddress);
    tokenMetadata["price"] = topFour[i].price;
    const date = new Date(topFour[i].date);
    tokenMetadata["date"] = date.toLocaleDateString();

    return tokenMetadata;
  });

  const resolved = await Promise.all(topFourMetadataPull);
  return resolved;
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
