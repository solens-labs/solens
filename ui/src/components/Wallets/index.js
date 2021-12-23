import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectDailyVolume,
  selectWeeklyVolume,
  selectWhaleBuyers,
  selectWhaleBuyersDay,
  selectWhaleSellers,
  selectWhaleSellersDay,
} from "../../redux/app";
import Loader from "../Loader";
import WhaleCard from "../WhaleCard";
import WalletsSection from "../WalletsSection";
import "./style.css";

export default function Wallets(props) {
  const whaleBuyersWeek = useSelector(selectWhaleBuyers);
  const whaleSellersWeek = useSelector(selectWhaleSellers);
  const whaleBuyersDay = useSelector(selectWhaleBuyersDay);
  const whaleSellersDay = useSelector(selectWhaleSellersDay);
  const volumeDay = useSelector(selectDailyVolume);
  const volumeWeek = useSelector(selectWeeklyVolume);

  const [timeframe, setTimeframe] = useState(1);
  const [timeframeTitle, setTimeframeTitle] = useState("LAST 24 HOURS");
  const [volume, setVolume] = useState(volumeDay);
  const [buyers, setBuyers] = useState(whaleBuyersDay);
  const [sellers, setSellers] = useState(whaleSellersDay);

  useEffect(() => {
    switch (timeframe) {
      case 1:
        setTimeframeTitle("LAST 24 HOURS");
        setVolume(volumeDay);
        setBuyers(whaleBuyersDay);
        setSellers(whaleSellersDay);
        break;
      case 7:
        setTimeframeTitle("LAST 7 DAYS");
        setVolume(volumeWeek);
        setBuyers(whaleBuyersWeek);
        setSellers(whaleSellersWeek);
        break;
    }
  }, [timeframe]);

  return (
    <div className="d-flex flex-wrap flex-column align-items-center justify-content-center col-12 mt-2">
      <h1 className="mb-0">Top Wallets</h1>
      <div className="d-flex flex-wrap flex-row justify-content-around col-1 mb-3">
        <button
          className={`btn_timeframe ${
            timeframe === 1 && "btn_timeframe_selected"
          }`}
          onClick={() => setTimeframe(1)}
        >
          1D
        </button>
        <button
          className={`btn_timeframe ${
            timeframe === 7 && "btn_timeframe_selected"
          }`}
          onClick={() => setTimeframe(7)}
        >
          1W
        </button>
      </div>
      {/* <h5 className="collection_stats_days">{timeframeTitle}</h5> */}
      <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

      <WalletsSection
        buyers={buyers}
        sellers={sellers}
        timeframe={timeframeTitle}
        volume={volume}
      />
    </div>
  );
}
