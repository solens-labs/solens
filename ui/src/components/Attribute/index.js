import React from "react";
import "./style.css";

export default function Attribute(props) {
  const { trait, value } = props;

  return (
    <div className="attribute_box">
      <h5>{trait}</h5>

      <p>{value}</p>
    </div>
  );
}
