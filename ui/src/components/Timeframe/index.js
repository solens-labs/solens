import React from "react";
import "./style.css";

export default function Timeframe(props) {
  const { currentTimeframe, setTimeframe, timeframes, intervals } = props;

  return (
    <div className="d-flex flex-wrap flex-row justify-content-around col-12">
      {timeframes.map((timeframe, i) => {
        return (
          <button
            className={`btn_timeframe ${
              currentTimeframe === intervals[i] && "btn_timeframe_selected"
            }`}
            onClick={() => setTimeframe(intervals[i])}
          >
            {timeframe}
          </button>
        );
      })}
    </div>
  );
}
