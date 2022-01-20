import React from "react";
import Transaction from "../Transaction";

export default function TransactionsList(props) {
  const { transactions } = props;

  return (
    <>
      <div className="transactions_header d-flex flex-row justify-content-around col-10">
        <h2>Date</h2>
        <h2>Signature</h2>
        <h2>Token</h2>
        <h2>Seller</h2>
        <h2>Buyer</h2>
        <h2>Price</h2>
      </div>
      <div className="transactions_table d-flex flex-column align-items-center col-12">
        {transactions.map((tx, i) => {
          return <Transaction txData={tx} />;
        })}
      </div>
    </>
  );
}
