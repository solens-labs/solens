import getDateFromDayNum from "./getDateFromDay";

export const calculateAllTimeVolume = (data) => {
  // let counter = 0;
  let array = [];
  data.map((dailyStat) => {
    // counter += dailyStat.volume;
    array.push(dailyStat.volume);
  });
  // setVolumeTotal(counter);
  return array;
};
export const calculateAllTimeTransactions = (data) => {
  let counter = 0;
  data.map((dailyStat) => {
    counter += Number(dailyStat.count);
  });

  return counter;
};
export const calculateAllTimeAverage = (data) => {
  let totalCount = 0;
  let totalVol = 0;

  data.map((marketplace) => {
    totalVol += marketplace.avg * marketplace.count;
    totalCount += marketplace.count;
  });

  const average = totalVol / totalCount;
  return average;
};
export const calculateLaunchDate = (data) => {
  const today = Date.now();
  const created = new Date(data.createdAt).getTime();
  const timeSince = (today - created) / (1000 * 3600 * 24);
  const daysSince = Math.ceil(timeSince);
  return daysSince;
};

export const splitMarketplaceData = (data) => {
  const solanart = [];
  const magiceden = [];

  data.map((dailyStat) => {
    if (dailyStat.marketplace === "solanart") {
      solanart.push(dailyStat);
    } else if (dailyStat.marketplace === "magiceden") {
      magiceden.push(dailyStat);
    }
  });

  return { solanart, magiceden };
};
export const getMarketplaceData = (dailyData) => {
  const marketplace = dailyData[0].marketplace;

  const dates = getDates(dailyData);
  const minMax = getMinMax(dailyData);
  const transactions = getTransactions(dailyData);
  const volume = getVolume(dailyData);
  const average = getAverage(dailyData);

  return {
    marketplace: marketplace,
    ...dates,
    ...minMax,
    ...transactions,
    ...volume,
    ...average,
  };
};

export const getDates = (data) => {
  let array = [];
  data.map((dailyStat) => {
    const date = new Date(dailyStat.date);

    const local = date.toLocaleDateString();
    const removeYear = local.slice(0, -5);
    array.push(removeYear);
  });

  return { dates: array };
};
export const getVolume = (data) => {
  let counter = 0;
  let array = [];
  data.map((dailyStat) => {
    counter += Number(dailyStat.volume);
    array.push(dailyStat.volume);
  });

  return {
    volume: counter,
    volumeArray: array,
  };
};
export const getTransactions = (data) => {
  let counter = 0;
  let array = [];
  data.map((dailyStat) => {
    counter += Number(dailyStat.count);
    array.push(dailyStat.count);
  });

  return {
    transactions: counter,
    transactionsArray: array,
  };
};
export const getAverage = (data) => {
  let txCount = 0;
  let counter = 0;
  let array = [];
  data.map((dailyStat) => {
    txCount += Number(dailyStat.count);
    counter += Number(dailyStat.avg) * Number(dailyStat.count);
    array.push(dailyStat.avg);
  });

  const average = counter / txCount;

  return {
    average: average,
    averageArray: array,
  };
};
export const getMinMax = (data) => {
  let minArray = [];
  let maxArray = [];
  data.map((dailyStat) => {
    minArray.push(dailyStat.min);
    maxArray.push(dailyStat.max);
  });

  const min = Math.min(...minArray);
  const max = Math.max(...maxArray);

  return {
    minPrice: min,
    maxPrice: max,
    minArray: minArray,
    maxArray: maxArray,
  };
};
export const marketplaceSelect = (unstylized) => {
  let marketplace = "";
  switch (unstylized) {
    case "magiceden":
      //   setMarketplace("Magic Eden");
      marketplace = "Magic Eden";
      break;
    case "solanart":
      marketplace = "Solanart";
      break;
  }

  return marketplace;
};
