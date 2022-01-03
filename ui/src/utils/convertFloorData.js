export const convertFloorData = (data) => {
  // const dataReversed = data.reverse();

  const datesArray = [];
  const floorsArray = [];

  data.map((record, i) => {
    const dateFull = new Date(record.date);
    const dateDay = dateFull.toLocaleDateString().slice(0, -5);
    // record["date"] = dateDay;
    datesArray.push(dateDay);
    floorsArray.push(record.floor);
  });

  // const tmp = {};
  // data.forEach((item, i) => {
  //   var obj = (tmp[item.date] = tmp[item.date] || { count: 0, total: 0 });
  //   obj.count++;
  //   obj.total += item.floor;
  // });

  // var dailyAverageFloor = Object.entries(tmp).map(function (entry) {
  //   const floor = (entry[1].total / entry[1].count).toFixed(2);
  //   datesArray.push(entry[0].slice(0, 5));
  //   floorsArray.push(Number(floor));

  // return {
  //   date: entry[0],
  //   floor: Number(floor.toFixed(2)),
  // };
  // });

  return {
    datesArray: datesArray,
    floorsArray: floorsArray,
  };
};
