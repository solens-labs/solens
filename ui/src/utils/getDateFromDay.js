export default function getDateFromDayNum(dayNum, year) {
  var date = new Date();
  if (year) {
    date.setFullYear(year);
  }
  date.setMonth(0);
  date.setDate(0);
  var timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
  var dayMilli = 1000 * 60 * 60 * 24;
  var dayNumMilli = dayNum * dayMilli;
  date.setTime(timeOfFirst + dayNumMilli);

  const finalDate = date.toLocaleDateString();
  return finalDate;
}
