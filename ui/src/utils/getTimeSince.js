import { DateTime, Interval } from "luxon";

export const getTimeSince = (date) => {
  const txTime = new Date(date);
  let now = DateTime.now();
  let interval = Interval.fromDateTimes(txTime, now);
  let timeSince = "";

  if (interval.length("days").toFixed(2) > 31) {
    timeSince = txTime.toLocaleDateString();
    return timeSince;
  }

  if (interval.length("days").toFixed(0) >= 2) {
    timeSince = interval.length("days").toFixed(0) + " days ago";
    return timeSince;
  }

  if (
    interval.length("days").toFixed(0) < 2 &&
    interval.length("days").toFixed(1) >= 1
  ) {
    timeSince = interval.length("days").toFixed(0) + " day ago";
    return timeSince;
  }

  if (
    interval.length("hours").toFixed(0) < 24 &&
    interval.length("hours").toFixed(1) >= 2
  ) {
    timeSince = interval.length("hours").toFixed(0) + " hours ago";
    return timeSince;
  }

  if (
    interval.length("hours").toFixed(0) < 2 &&
    interval.length("hours").toFixed(1) >= 1
  ) {
    timeSince = interval.length("hours").toFixed(0) + " hour ago";
    return timeSince;
  }

  if (
    interval.length("minutes").toFixed(0) < 60 &&
    interval.length("minutes").toFixed(1) >= 2
  ) {
    timeSince = interval.length("minutes").toFixed(0) + " minutes ago";
    return timeSince;
  }

  if (
    interval.length("minutes").toFixed(0) < 2 &&
    interval.length("minutes").toFixed(1) >= 1
  ) {
    timeSince = interval.length("minutes").toFixed(0) + " minute ago";
    return timeSince;
  }

  if (interval.length("seconds").toFixed(0) < 61) {
    timeSince = interval.length("seconds").toFixed(0) + " seconds ago";
    return timeSince;
  }
};
