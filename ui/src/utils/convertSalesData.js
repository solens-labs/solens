import { shortenAddress } from "../candy-machine";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const addTransaction = (transaction) => {
  const date = new Date(transaction["date"]);
  const address = (
    <a
      href={`https://explorer.solana.com/address/${transaction["mint"]}`}
      target="_blank"
      style={{ textDecoration: "none" }}
    >
      {shortenAddress(transaction["mint"])}
      {/* {transaction["mint"]} */}
    </a>
  );
  const price = Number(transaction["price"]).toFixed(2);

  return {
    date: date.toLocaleDateString(),
    address: address,
    price: price,
  };
};

export default function convertData(transactions, lens) {
  const makeDataLevel = () => {
    // const len = lens[depth];
    const requestedLength = Math.min(transactions.length, lens);

    return range(requestedLength).map((d, i) => {
      return {
        ...addTransaction(transactions[i]),
      };
    });
  };

  const exportedData = makeDataLevel();
  //   console.log(exportedData);

  return exportedData;
}
