import { shortenAddress } from "../candy-machine";
import { explorerLink } from "../constants/constants";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = (wallet) => {
  const count = wallet["count"];
  const address = (
    <a
      href={explorerLink("account", wallet["wallet"])}
      target="_blank"
      style={{ textDecoration: "none" }}
    >
      {shortenAddress(wallet["wallet"])}
    </a>
  );
  // const total = Number(buyer["total"]).toFixed(2);
  const total = Number(wallet["volume"]).toFixed(2);
  const average = Number(wallet["avg"]).toFixed(2);
  const min = Number(wallet["min"]).toFixed(2);
  const max = Number(wallet["max"]).toFixed(2);

  return {
    count: count,
    address: address,
    total: total,
    average: average,
    min: min,
    max: max,
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
