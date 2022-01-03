import React from "react";
import "./style.css";

export default function Launch() {
  return (
    <div className="col-12 d-flex flex-column align-items-center">
      <button
        className="collection_stat"
        style={{
          border: "1px solid black",
          color: "white",
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
}
