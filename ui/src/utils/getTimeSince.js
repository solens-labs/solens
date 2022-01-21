import { DateTime, Interval } from "luxon";

export const getTimeSince = (now, interval) => {
  let timeSince = "";

  console.log(interval.length("days").toFixed(0) + " days");
  console.log(interval.length("hours").toFixed(0) + " hours");
  console.log(interval.length("minutes").toFixed(0) + " minutes");

  if (interval.length("days").toFixed(0) >= 2) {
    timeSince = interval.length("days").toFixed(0) + " days ago";
    return timeSince;
  }

  if (
    interval.length("days").toFixed(0) < 2 &&
    interval.length("days").toFixed(0) >= 1
  ) {
    timeSince = interval.length("days").toFixed(0) + " day ago";
    return timeSince;
  }

  if (interval.length("hours").toFixed(0) < 24) {
    timeSince = interval.length("hours").toFixed(0) + " hours ago";
    return timeSince;
  }

  if (interval.length("hours").toFixed(0) < 24) {
    timeSince = interval.length("hours").toFixed(0) + " hours ago";
    return timeSince;
  }

  if (
    interval.length("hours").toFixed(0) >= 1 &&
    interval.length("hours").toFixed(0) < 2
  ) {
    timeSince = interval.length("hours").toFixed(0) + " hour ago";
    return timeSince;
  }

  if (interval.length("minutes").toFixed(0) < 60) {
    timeSince = interval.length("mintes").toFixed(0) + " minutes ago";
    return timeSince;
  }
};
