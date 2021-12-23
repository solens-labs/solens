import React from "react";
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
import "./style.css";

export default function Wallets(props) {
  const whaleBuyers = useSelector(selectWhaleBuyers);
  const whaleSellers = useSelector(selectWhaleSellers);
  const whaleBuyersDay = useSelector(selectWhaleBuyersDay);
  const whaleSellersDay = useSelector(selectWhaleSellersDay);
  const volumeDay = useSelector(selectDailyVolume);
  const volumeWeek = useSelector(selectWeeklyVolume);

  return (
    <div className="d-flex flex-wrap justify-content-center col-12 ">
      <div className="d-flex flex-column align-items-center col-12 col-xxl-10 mb-5">
        <h1 className="mb-0">Whales of the Day</h1>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        <h5
          className="collection_stats_days font_white mt-2 mb-3"
          style={{ fontSize: "1.5rem" }}
        >
          TOP BUYERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {whaleBuyersDay.length === 0 && <Loader />}
          {whaleBuyersDay.map((whale, i) => {
            if (i <= 3) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
                >
                  <WhaleCard data={whale} type={"BUYS"} volume={volumeDay} />
                </div>
              );
            }
          })}
        </div>

        <h5
          className="collection_stats_days font_white mt-2 mb-3"
          style={{ fontSize: "1.5rem" }}
        >
          TOP SELLERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {whaleSellersDay.length === 0 && <Loader />}

          {whaleSellersDay.map((whale, i) => {
            if (i <= 3) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
                >
                  <WhaleCard data={whale} type={"SALES"} volume={volumeDay} />
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="d-flex flex-column align-items-center col-12 col-xxl-10">
        <h1 className="mb-0">Whales of the Week</h1>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        <h5
          className="collection_stats_days font_white mt-2 mb-3"
          style={{ fontSize: "1.5rem" }}
        >
          TOP BUYERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {whaleBuyers.length === 0 && <Loader />}
          {whaleBuyers.map((whale, i) => {
            if (i <= 3) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
                >
                  <WhaleCard data={whale} type={"BUYS"} volume={volumeWeek} />
                </div>
              );
            }
          })}
        </div>

        <h5
          className="collection_stats_days font_white mt-2 mb-3"
          style={{ fontSize: "1.5rem" }}
        >
          TOP SELLERS
        </h5>

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
          {whaleSellers.length === 0 && <Loader />}

          {whaleSellers.map((whale, i) => {
            if (i <= 3) {
              return (
                <div
                  key={i}
                  className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center mb-4"
                >
                  <WhaleCard data={whale} type={"SALES"} volume={volumeWeek} />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
