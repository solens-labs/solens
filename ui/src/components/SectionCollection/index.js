import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectAllCollections, setCollection } from "../../redux/app";
import CollectionCard from "../CardCollection";
import "./style.css";

export default function CollectionSection(props) {
  const { collections, sort } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  // Select individual collection for dtails
  const selectCollection = (collection) => {
    dispatch(setCollection(collection));
    const symbol = collection.symbol;
    history.push("/collection/" + symbol);
  };

  return (
    <div className="col-12 d-flex flex-row flex-wrap">
      {collections.map((collection, i) => {
        return (
          <div
            key={i}
            className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
          >
            <CollectionCard
              id={i}
              collection={collection}
              sort={sort}
              onClick={() => selectCollection(collection)}
            />
          </div>
        );
      })}
    </div>
  );
}
