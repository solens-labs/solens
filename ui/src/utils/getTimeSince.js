import { DateTime, Interval } from "luxon";

export const getTimeSince = (date) => {
  const txTime = new Date(date);
  let now = DateTime.now();
  let interval = Interval.fromDateTimes(txTime, now);
  let timeSince = "";

  if (interval.length("days").toFixed(1) > 31) {
    timeSince = txTime.toLocaleDateString();
    return timeSince;
  }

  if (interval.length("days").toFixed(1) >= 2) {
    timeSince = interval.length("days").toFixed(0) + " days ago";
    return timeSince;
  }

  if (
    interval.length("seconds").toFixed(1) < 172800 &&
    interval.length("seconds").toFixed(1) >= 86400
  ) {
    timeSince = "1 day ago";
    return timeSince;
  }

  if (
    interval.length("seconds").toFixed(1) < 86400 &&
    interval.length("seconds").toFixed(1) >= 7200
  ) {
    timeSince = interval.length("hours").toFixed(0) + " hours ago";
    return timeSince;
  }

  if (
    interval.length("seconds").toFixed(1) < 7200 &&
    interval.length("seconds").toFixed(1) >= 3600
  ) {
    timeSince = "1 hour ago";
    return timeSince;
  }

  if (
    interval.length("seconds").toFixed(1) < 3600 &&
    interval.length("seconds").toFixed(1) >= 120
  ) {
    timeSince = interval.length("minutes").toFixed(0) + " mins ago";
    return timeSince;
  }

  if (
    interval.length("seconds").toFixed(1) < 120 &&
    interval.length("seconds").toFixed(1) >= 60
  ) {
    timeSince = "1 minute ago";
    return timeSince;
  }

  if (interval.length("seconds").toFixed(1) < 60) {
    timeSince = interval.length("seconds").toFixed(0) + " secs ago";
    return timeSince;
  }
};
