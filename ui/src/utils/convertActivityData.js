import { shortenAddress } from "../candy-machine";
import { explorerLink } from "../constants/constants";
import { themeColors } from "../constants/constants";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = (transaction) => {
  const date = new Date(transaction["date"]);
  const price = Number(transaction["price"]).toFixed(2);
  const buyerAddress = (
    <a
      href={explorerLink("account", transaction["buyer"])}
      target="_blank"
      style={{ textDecoration: "none", color: themeColors[0] }}
    >
      {shortenAddress(transaction["buyer"])}
    </a>
  );
  const sellerAddress = (
    <a
      href={explorerLink("account", transaction["seller"])}
      target="_blank"
      style={{ textDecoration: "none", color: themeColors[0] }}
    >
      {shortenAddress(transaction["seller"])}
    </a>
  );

  return {
    date: date.toLocaleDateString(),
    price: price,
    buyer: buyerAddress,
    seller: sellerAddress,
  };
};

export default function convertData(transactions, lens = 100) {
  const makeDataLevel = () => {
    const requestedLength = Math.min(transactions.length, lens);

    return range(requestedLength).map((d, i) => {
      return {
        ...addTransaction(transactions[i]),
      };
    });
  };

  const exportedData = makeDataLevel();

  return exportedData;
}
