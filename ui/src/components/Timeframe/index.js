import React from "react";
import "./style.css";

export default function Timeframe(props) {
  const { currentTimeframe, setTimeframe, timeframes, intervals } = props;

  return (
    <div className="d-flex flex-wrap flex-row justify-content-around col-12">
      <button
        className={`btn_timeframe ${
          currentTimeframe === intervals[0] && "btn_timeframe_selected"
        }`}
        onClick={() => setTimeframe(intervals[0])}
      >
        {timeframes[0]}
      </button>
      <button
        className={`btn_timeframe ${
          currentTimeframe === intervals[1] && "btn_timeframe_selected"
        }`}
        onClick={() => setTimeframe(intervals[1])}
      >
        {timeframes[1]}
      </button>
      <button
        className={`btn_timeframe ${
          currentTimeframe === intervals[2] && "btn_timeframe_selected"
        }`}
        onClick={() => setTimeframe(intervals[2])}
      >
        {timeframes[2]}
      </button>
    </div>
  );
}
