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

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = (transaction, allCollections) => {
  const date = new Date(transaction["date"]) || "xx/xx/xxxx";
  const seller = transaction["seller"] || "";
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

  const mintAddress = (
    <a
      href={`/mint/${transaction["mint"]}`}
      style={{ textDecoration: "none", color: themeColors[0] }}
    >
      {shortenAddress(transaction["mint"])}
    </a>
  );
  const mint = transaction["mint"];
  let priceNumber = Number(transaction["price"]).toFixed(4);
  let price = "◎ " + parseFloat(priceNumber);

  const namecheck =
    transaction["symbol"] &&
    allCollections.filter((item) => item.symbol === transaction["symbol"]);

  let symbol =
    namecheck?.length > 0 ? (
      <a
        href={`/collection/${transaction["symbol"]}`}
        style={{ textDecoration: "none", color: themeColors[0] }}
      >
        {namecheck[0].name}
      </a>
    ) : (
      "Unverified"
    );
  const txType = transaction["type"];
  const marketplace = marketplaceSelect(transaction["marketplace"]) || "";

  return {
    symbol: symbol,
    date: date.toLocaleDateString(),
    price: price,
    buyerLink: buyerLink,
    sellerLink: sellerLink,
    buyer: buyer,
    seller: seller,
    mint: mint,
    txType: txType,
    mintAddress: mintAddress,
    marketplace: marketplace,
  };
};

export default function convertData(transactions, allCollections, lens = 100) {
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
        ...addTransaction(transactions[i], allCollections),
      };
    });
  };

  const exportedData = makeDataLevel();

  return exportedData;
}
