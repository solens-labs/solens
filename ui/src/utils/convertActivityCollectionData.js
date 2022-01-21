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

const addTransaction = async (transaction) => {
  let image = "";

  const metadata = await getTokenMetadata(transaction["mint"]);
  if (metadata) {
    let link = metadata?.image;
    image = (
      <a
        href={`/mint/${transaction["mint"]}`}
        style={{ textDecoration: "none" }}
      >
        <img src={link} alt="nft_image" className="activity_image" />
      </a>
    );
  }

  const timeSince = getTimeSince(transaction["date"]);
  const date = <span>{timeSince}</span>;

  const seller = transaction["owner"] || "";
  const marketplace = marketplaceSelect(transaction["marketplace"]) || "";
  const sellerLink = (
    <a
      href={explorerLink("account", transaction["seller"])}
      target="_blank"
      style={{ textDecoration: "none", color: themeColors[0] }}
    >
      {shortenAddress(transaction["owner"])}
    </a>
  );
  const buyer = transaction["new_owner"] || "";
  const buyerLink =
    transaction["new_owner"] === seller ? (
      ""
    ) : (
      <a
        href={explorerLink("account", transaction["buyer"])}
        target="_blank"
        style={{ textDecoration: "none", color: themeColors[0] }}
      >
        {shortenAddress(transaction["new_owner"])}
      </a>
    );

  const txType = transaction["type"];
  let symbol = "";
  let type = "";
  let priceNumber = Number(transaction["price"]).toFixed(3);
  let price = parseFloat(priceNumber);

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
          style={{ fill: "rgba(86, 143, 56, 0.8)" }}
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

  const txHash = (
    <a
      href={explorerLink("tx", transaction["tx"])}
      style={{ textDecoration: "none", color: themeColors[0] }}
      target="_blank"
    >
      {transaction["tx"].slice(0, 6) + "..."}
    </a>
  );

  return {
    image: image,
    symbol: symbol,
    type: type,
    date: date,
    price: price,
    buyerLink: buyerLink,
    sellerLink: sellerLink,
    buyer: buyer,
    seller: seller,
    txHash: txHash,
    marketplace: marketplace,
  };
};

export default async function convertData(transactions, lens = 100) {
  const makeDataLevel = () => {
    const requestedLength = Math.min(transactions.length, lens);

    return range(requestedLength).map(async (d, i) => {
      const returnTX = await addTransaction(transactions[i]);
      const resolved = Promise.resolve(returnTX);
      return resolved;
      // return {
      //   ...addTransaction(transactions[i]),
      // };
    });
  };

  const exportedData = makeDataLevel();

  return exportedData;
}
