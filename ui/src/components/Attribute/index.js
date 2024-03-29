import React from "react";
import "./style.css";

export default function Attribute(props) {
  const { trait, value } = props;

  const mobile = window.innerWidth < 990;
  let traitShort = trait || "None";
  let valueShort = value || "None";

  if (mobile) {
    if (trait?.length > 12) {
      traitShort = trait.slice(0, 12) + "...";
    }

    if (value?.length > 11) {
      valueShort = value.slice(0, 11) + "...";
    }
  } else {
    if (trait?.length > 20) {
      traitShort = trait.slice(0, 20) + "...";
    }

    if (value?.length > 13) {
      valueShort = value.slice(0, 13) + "...";
    }
  }

  return (
    <div className="attribute_box">
      <div className="attribute_box_inner">
        <h5>{traitShort}</h5>

        <p>{valueShort}</p>
      </div>
    </div>
  );
}
