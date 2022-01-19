import React from "react";
import "./style.css";

export default function CollectionCard(props) {
  const { sort, collection, stats, onClick } = props;

  const stat_caption = {
    "total_volume": {
      caption: "Total Volume",
      unit: " SOL",
    },
    "weekly_volume": {
      caption: "Weekly Volume",
      unit: " SOL",
    },
    "daily_volume": {
      caption: "Today's Volume",
      unit: " SOL",
    },
    "past_day_volume": {
      caption: "Yesterday's Volume",
      unit: " SOL",
    },
    "daily_change": {
      caption: "24H Volume",
      unit: "%",
    },
    "days_launched": {
      caption: "Released",
      unit: " Days",
    },
  };

  return (
    <div
      className="collection_card d-flex flex-column justify-content-between"
      onClick={() => onClick()}
    >
      <div className="collection_image_container">
        <img src={collection.image} alt="" className="collection_card_image" />
      </div>
      <h2 className="collection_card_title">{collection.name}</h2>

      <div className="collection_card_stat col-12">
        <div className="d-flex justify-content-center col-12">
          <hr
            style={{
              color: "white",
              width: "50%",
              padding: "0px",
              margin: "0px 0px 10px 0px",
            }}
          />
        </div>
        <h1 className="collection_card_info">
          {collection[sort].toLocaleString("en", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          {stat_caption[sort].unit}
        </h1>
        <h1 className="collection_info_header">{stat_caption[sort].caption}</h1>
      </div>
    </div>
  );
}