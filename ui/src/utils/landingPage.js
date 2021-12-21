export const getTopTrending = (collections, length) => {
  const needToSort = [...collections];

  const sorted = needToSort.sort((a, b) => {
    const volumeA = a["daily_volume"];
    const volumeB = b["daily_volume"];
    const volumePreviousA = a["past_day_volume"];
    const volumePreviousB = b["past_day_volume"];
    const changeA = (volumeA - volumePreviousA) / volumePreviousA;
    const changeB = (volumeB - volumePreviousB) / volumePreviousB;

    return changeB - changeA;
  });

  const aboveZero = sorted.filter((collection) => {
    return collection.past_day_volume > 0;
  });

  const topTrendingVolume = aboveZero.slice(0, length);
  return topTrendingVolume;
};
