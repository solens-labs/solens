import React from "react";
import "./style.css";

export default function Transaction(props) {
  const { txData } = props;

  const shortenAddress = (address) => {
    if (!address) {
      return "Loading...";
    }
    return (
      address.substring(0, 6) + "..." + address.substring(address.length - 6)
    );
  };
  const link = (type, hash) => {
    switch (type) {
      case "tx":
        return `https://explorer.solana.com/tx/${hash}`;
        break;
      case "account":
        return `https://explorer.solana.com/address/${hash}`;
        break;
    }
  };

  const date = new Date(txData.date);
  const txHash = shortenAddress(txData.tx);
  const token = shortenAddress(txData.mint);
  const sender = shortenAddress(txData.owner);
  const recipient = shortenAddress(txData.new_owner);
  const price = txData.price.toFixed(2) + " SOL";

  return (
    <div className="d-flex flex-row justify-content-around col-10 p-2">
      <h2>{date.toLocaleDateString()}</h2>
      <h2>
        <a href={link("tx", txData.tx)} target="_blank" className="transaction">
          {txHash}
        </a>
      </h2>
      <h2>
        <a
          href={link("account", txData.mint)}
          target="_blank"
          className="transaction"
        >
          {token}
        </a>
      </h2>
      <h2>
        <a
          href={link("account", txData.owner)}
          target="_blank"
          className="transaction"
        >
          {sender}
        </a>
      </h2>
      <h2>
        <a
          href={link("account", txData.new_owner)}
          target="_blank"
          className="transaction"
        >
          {recipient}
        </a>
      </h2>
      <h2>{price}</h2>
    </div>
  );
}
