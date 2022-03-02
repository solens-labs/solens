import { shortenAddress } from "../candy-machine";
import { explorerLink } from "../constants/constants";
import { themeColors } from "../constants/constants";
import BuyIcon from "@mui/icons-material/Paid";
import CancelIcon from "@mui/icons-material/Cancel";
// import ListIcon from "@mui/icons-material/Sell";
import ListIcon from "@mui/icons-material/FeaturedPlayList";
import OfferIcon from "@mui/icons-material/AttachMoney";
import AcceptOfferIcon from "@mui/icons-material/ThumbUp";
import CancelOfferIcon from "@mui/icons-material/ThumbDown";
import UnknownIcon from "@mui/icons-material/QuestionMark";
import { marketplaceSelect } from "./collectionStats";
import { getTimeSince } from "./getTimeSince";
import { getTokenMetadata } from "./getMetadata";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addCollection = (collection) => {
  const symbol = collection["symbol"];
  let image = (
    <a href={`/collection/${symbol}`} style={{ textDecoration: "none" }}>
      <img
        src={collection["image"]}
        className="activity_image"
        alt="collection image"
        loading="lazy"
      />
    </a>
  );

  let nameSplit = collection["name"].toLowerCase().split(" ");
  for (let i = 0; i < nameSplit.length; i++) {
    if (nameSplit[i]) {
      nameSplit[i] = nameSplit[i][0].toUpperCase() + nameSplit[i].substr(1);
    }
  }
  let nameJoined = nameSplit.join(" ");
  const name =
    nameJoined.length >= 25 ? nameJoined.slice(0, 22) + "..." : nameJoined;

  const date = new Date(collection["createdAt"]);
  const time = date.getTime();
  const launch = {
    date: date.toLocaleDateString(),
    time: time,
  };

  const dailyChange =
    collection["past_day_volume"] === 0 ? 0 : collection["daily_change"];

  const pastDayVolume = collection["past_day_volume"];
  const daysLaunched = collection["days_launched"] + " Days";

  const trade = (
    <a
      href={`/nfts/${collection["symbol"]}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="connect_button2"
        style={{
          border: "1px solid black",
          color: "white",
          borderRadius: 15,
        }}
      >
        TRADE
      </div>
    </a>
  );
  const analytics = (
    <a href={`/collection/${symbol}`} style={{ textDecoration: "none" }}>
      <div
        className="connect_button2"
        style={{
          border: "1px solid black",
          color: "white",
          borderRadius: 15,
        }}
      >
        DETAILS
      </div>
    </a>
  );

  const volumeDay = collection["daily_volume"];
  const volumeWeek = collection["weekly_volume"];
  const volumeTotal = collection["total_volume"];
  const supply = collection["supply"];

  return {
    image: image,
    collection: { name: name, supply: supply, symbol: symbol },
    dailyChange: dailyChange,
    volumeDay: volumeDay,
    volumeWeek: volumeWeek,
    volumeTotal: volumeTotal,
    supply: supply,
    date: launch,
    launch: daysLaunched,
    trade: trade,
    analytics: analytics,
    pastDayVolume: pastDayVolume,
  };
};

export default function convertData(collections) {
  const makeDataLevel = () => {
    return range(collections.length).map((d, i) => {
      const returnTX = addCollection(collections[i]);
      return returnTX;
    });
  };

  const exportedData = makeDataLevel();
  // console.log({ exportedData });

  const tableSorter = (a, b) => {
    const type = "volumeDay";

    var a1 = a[type];
    var b1 = b[type];

    if (a1 < b1) return 1;
    else if (a1 > b1) return -1;
    else return 0;
  };

  const sortedExport = exportedData.sort(tableSorter);
  // console.log({ sortedExport });

  return exportedData;
}
