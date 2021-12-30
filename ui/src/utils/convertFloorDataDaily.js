export const convertFloorDataDaily = (data) => {
  const dataReversed = data.reverse();

  dataReversed.map((record, i) => {
    const dateFull = new Date(record.date);
    const dateDay = dateFull.toLocaleDateString();
    record["date"] = dateDay;
  });

  const tmp = {};
  data.forEach((item, i) => {
    var obj = (tmp[item.date] = tmp[item.date] || { count: 0, total: 0 });
    obj.count++;
    obj.total += item.floor;
  });

  const datesArray = [];
  const floorsArray = [];
  const symbol = data[0].symbol;
  const marketplace = data[0].marketplace;

  var dailyAverageFloor = Object.entries(tmp).map(function (entry) {
    const floor = (entry[1].total / entry[1].count).toFixed(2);
    datesArray.push(entry[0].slice(0, 5));
    floorsArray.push(Number(floor));

    // return {
    //   date: entry[0],
    //   floor: Number(floor.toFixed(2)),
    //   symbol: data[0].symbol,
    //   marketplace: data[0].marketplace,
    // };
  });

  return {
    datesArray: datesArray,
    floorsArray: floorsArray,
    symbol: symbol,
    marketplace: marketplace,
  };
};
