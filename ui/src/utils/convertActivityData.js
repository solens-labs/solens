import { shortenAddress } from "../candy-machine";
import { explorerLink } from "../constants/constants";
import { themeColors } from "../constants/constants";
import BuyIcon from "@mui/icons-material/AttachMoney";
import CancelIcon from "@mui/icons-material/Cancel";
import ListIcon from "@mui/icons-material/FeaturedPlayList";
import AcceptOfferIcon from "@mui/icons-material/ThumbUp";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = (transaction, prevPrice) => {
  const date = new Date(transaction["date"]);
  const seller = transaction["seller"];
  const marketplace = transaction["marketplace"];
  const sellerLink = (
    <a
      href={explorerLink("account", transaction["seller"])}
      target="_blank"
      style={{ textDecoration: "none", color: themeColors[0] }}
    >
      {shortenAddress(transaction["seller"])}
    </a>
  );
  const buyer = transaction["buyer"];
  const buyerLink =
    transaction["buyer"] === seller ? (
      // " -- "
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
  let priceNumber = Number(transaction["price"]).toFixed(2);
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
  }

  // let type = "";
  // switch (transaction["type"]) {
  //   case "buy":
  //     type = (
  //       <div className="col-12 d-flex justify-content-between">
  //         <span className="p-3 pt-0 pb-0">Buy</span>
  //         <BuyIcon style={{ fill: "rgba(86, 143, 56, 1)" }} fontSize="small" />
  //       </div>
  //     );
  //     break;
  //   case "list":
  //     type = (
  //       <div className="col-12 d-flex justify-content-between">
  //         <span className="p-3 pt-0 pb-0">List</span>
  //         <ListIcon
  //           style={{ fill: "rgba(255,255,255,0.6)" }}
  //           fontSize="small"
  //         />
  //       </div>
  //     );
  //     break;
  //   case "cancel":
  //     type = (
  //       <div className="col-12 d-flex justify-content-between">
  //         <span className="p-3 pt-0 pb-0">Cancel</span>
  //         <CancelIcon
  //           style={{ fill: "rgba(201, 87, 87, 1)" }}
  //           fontSize="small"
  //         />
  //       </div>
  //     );
  //     break;
  // }

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
    date: date.toLocaleDateString(),
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
