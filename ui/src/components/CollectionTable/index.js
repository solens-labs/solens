import React from "react";
import Collection from "../CollectionStats";
import "./style.css";

export default function CollectionList(props) {
  const collections = ["aurory", "ggsg_enigma_crystals"];
  return (
    <>
      {collections.map((collection) => {
        return (
          <>
            <Collection name={collection} />
            <hr style={{ color: "black", width: "100%", margin: "40px 0px" }} />
          </>
        );
      })}
    </>
  );
}
