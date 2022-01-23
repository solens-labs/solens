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

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = (transaction, prevPrice) => {
  const timeSince = getTimeSince(transaction["date"]);
  const date = <span>{timeSince}</span>;

  const seller = transaction["seller"] || "";
  const marketplace = marketplaceSelect(transaction["marketplace"]) || "";
  const sellerLink = (
    <a
      href={explorerLink("account", transaction["seller"])}
      target="_blank"
      style={{ textDecoration: "none", color: themeColors[0] }}
    >
      {shortenAddress(transaction["seller"])}
    </a>
  );
  const buyer = transaction["buyer"] || "";
  const buyerLink =
    transaction["buyer"] === seller ? (
      ""
    ) : (
      <a
        href={explorerLink("account", transaction["buyer"])}
        target="_blank"
        style={{ textDecoration: "none", color: themeColors[0] }}
      >
        {shortenAddress(transaction["buyer"])}
      </a>
    );

  const txType = transaction["type"];
  let symbol = "";
  let type = "";
  let priceNumber = Number(transaction["price"]).toFixed(3);
  let price = "◎ " + parseFloat(priceNumber);

  switch (txType) {
    case "buy":
      symbol = (
        <BuyIcon style={{ fill: "rgba(86, 143, 56, 1)" }} fontSize="small" />
      );
      type = "Sale";
      break;
    case "accept_offer":
      symbol = (
        <AcceptOfferIcon
          style={{ fill: "rgba(86, 143, 56, 1)" }}
          fontSize="small"
        />
      );
      type = "Offer Accepted";
      break;
    case "list":
      symbol = (
        <ListIcon
          style={{ fill: "rgba(255, 255, 255, 0.5)" }}
          fontSize="small"
        />
      );
      type = "List";
      break;
    case "update":
      symbol = (
        <ListIcon
          style={{ fill: "rgba(255, 255, 255, 0.5)" }}
          fontSize="small"
        />
      );
      type = "Update";
      break;
    case "cancel":
      symbol = (
        <CancelIcon style={{ fill: "rgba(201, 87, 87, 1)" }} fontSize="small" />
      );
      type = "Cancel";
      price = "";
      // price = " -- ";
      break;
    case "cancel_offer":
      symbol = (
        <CancelOfferIcon
          style={{ fill: "rgba(201, 87, 87, 1)" }}
          fontSize="small"
        />
      );
      type = "Offer Cancelled";
      break;
    case "offer":
      symbol = (
        <OfferIcon style={{ fill: "rgba(86, 143, 56, 1)" }} fontSize="small" />
      );
      type = "Sale";
      break;
    default:
      symbol = (
        <UnknownIcon
          style={{ fill: "rgba(139, 64, 179, 1)" }}
          fontSize="small"
        />
      );
      type = "Unknown";
  }

  // const differenceCalc = (
  //   ((Number(transaction["price"]) - prevPrice) / prevPrice) *
  //   100
  // ).toFixed(2);
  // let difference = isFinite(differenceCalc) ? differenceCalc : " -- ";

  // if (type === "cancel" || type === "sale") {
  //   difference = " -- ";
  // }

  return {
    symbol: symbol,
    type: type,
    date: date,
    price: price,
    // change: difference,
    buyerLink: buyerLink,
    sellerLink: sellerLink,
    buyer: buyer,
    seller: seller,
    marketplace: marketplace,
  };
};

export default function convertData(transactions, lens = 100) {
  const makeDataLevel = () => {
    const requestedLength = Math.min(transactions.length, lens);

    return range(requestedLength).map((d, i) => {
      const getPreviousPrice = () => {
        return i === transactions.length - 1
          ? "--"
          : Number(transactions[i + 1].price);
      };

      const prevPrice = getPreviousPrice();

      return {
        ...addTransaction(transactions[i], prevPrice),
      };
    });
  };

  const exportedData = makeDataLevel();

  return exportedData;
}
