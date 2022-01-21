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
import { getTokenMetadata } from "./getMetadata";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = async (transaction, allCollections, user) => {
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

  const date = new Date(transaction["date"]) || "xx/xx/xxxx";
  let buyer = transaction["buyer"];
  let seller = transaction["seller"];
  let transactor = "";
  let txType = "";
  let detail = "";

  if (buyer === user) {
    transactor = (
      <a
        href={explorerLink("account", seller)}
        target="_blank"
        style={{ textDecoration: "none", color: themeColors[0] }}
      >
        {shortenAddress(seller)}
      </a>
    );
    txType = <BuyIcon style={{ fill: themeColors[0] }} fontSize="medium" />;
    detail = "Buy";
  } else if (seller === user) {
    transactor = (
      <a
        href={explorerLink("account", buyer)}
        target="_blank"
        style={{ textDecoration: "none", color: themeColors[0] }}
      >
        {shortenAddress(buyer)}
      </a>
    );
    txType = <OfferIcon style={{ fill: themeColors[0] }} fontSize="small" />;
    detail = "Sell";
  }

  const mintLink = (
    <a
      href={`/mint/${transaction["mint"]}`}
      style={{ textDecoration: "none", color: themeColors[0] }}
    >
      {shortenAddress(transaction["mint"])}
    </a>
  );
  let priceNumber = Number(transaction["price"]).toFixed(4);
  // let price = "◎ " + parseFloat(priceNumber);
  let price = parseFloat(priceNumber);

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

  const marketplace = marketplaceSelect(transaction["marketplace"]) || "";

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
    txType: txType,
    detail: detail,
    mintLink: mintLink,
    price: price,
    marketplace: marketplace,
    symbol: symbol,
    transactor: transactor,
    txHash: txHash,
    date: date.toLocaleDateString(),
  };
};

export default async function convertData(
  transactions,
  allCollections,
  user,
  lens = 100
) {
  const makeDataLevel = () => {
    const requestedLength = Math.min(transactions.length, lens);

    return range(requestedLength).map(async (d, i) => {
      // const getPreviousPrice = () => {
      //   return i === transactions.length - 1
      //     ? "--"
      //     : Number(transactions[i + 1].price);
      // };
      // const prevPrice = getPreviousPrice();

      const returnTX = await addTransaction(
        transactions[i],
        allCollections,
        user
      );
      const resolved = Promise.resolve(returnTX);
      return resolved;
      // return {
      //   ...addTransaction(transactions[i], allCollections, user),
      // };
    });
  };

  const exportedData = makeDataLevel();

  return exportedData;
}
