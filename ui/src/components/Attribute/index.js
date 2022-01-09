import React from "react";
import "./style.css";

export default function Attribute(props) {
  const { trait, value } = props;

  const mobile = window.innerWidth < 990;
  let traitShort = trait;
  let valueShort = value;

  if (mobile) {
    if (trait.length > 12) {
      traitShort = trait.slice(0, 12) + "...";
    }

    if (value.length > 11) {
      valueShort = value.slice(0, 11) + "...";
    }
  }

  return (
    <div className="attribute_box">
      <h5>{traitShort}</h5>

      <p>{valueShort}</p>
    </div>
  );
}
