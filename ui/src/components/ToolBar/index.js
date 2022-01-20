import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllCollections, setSort } from "../../redux/app";
import "./style.css";

export default function ToolBar(props) {
  const dispatch = useDispatch();
  const allCollections = useSelector(selectAllCollections);

  return (
    <div className="mb-4 d-flex col-8 justify-content-around">
      <input
        type="text"
        placeholder="Search"
        className="search_collection_input"
      />

      <select
        name="sort"
        id="sort"
        className="select_collection_filter"
        onChange={(e) => dispatch(setSort(e.target.value))}
      >
        <option value="" disabled selected>
          Sort by
        </option>
        <option value="volume">Volume</option>
        <option value="transactions">Transactions</option>
        <option value="average">Average</option>
      </select>
    </div>
  );
}
