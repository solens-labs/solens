import { shortenAddress } from "../candy-machine";
import { explorerLink } from "../constants/constants";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = (buyer) => {
  const count = buyer["count"];
  const address = (
    <a
      href={explorerLink("account", buyer["account"])}
      target="_blank"
      style={{ textDecoration: "none" }}
    >
      {shortenAddress(buyer["account"])}
    </a>
  );
  // const total = Number(buyer["total"]).toFixed(2);
  const total = Number(buyer["volume"]).toFixed(2);
  const average = Number(buyer["avg"]).toFixed(2);
  const min = Number(buyer["min"]).toFixed(2);
  const max = Number(buyer["max"]).toFixed(2);

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