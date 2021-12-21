import React, { useEffect, useState } from "react";
import "./style.css";
import logo from "../../assets/images/logo2.png";
import { Link } from "react-router-dom";
import CollectionSection from "../CollectionSection";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCollections,
  selectSolPrice,
  setSolPrice,
} from "../../redux/app";
import { getTopTrending } from "../../utils/landingPage";
import axios from "axios";
import { links } from "../../constants/constants";

export default function LandingPage(props) {
  const dispatch = useDispatch();
  const collections = useSelector(selectAllCollections);
  const [trending, setTrending] = useState([]);
  const solPrice = useSelector(selectSolPrice);
  const [volumeTotal, setVolumeTotal] = useState(0);

  // Calculate Trending Collections
  useEffect(() => {
    if (collections.length > 0) {
      const needToSort = [...collections];
      const sort = "daily_change";
      const trending = needToSort.sort((a, b) => {
        return b[sort] - a[sort];
      });
      const relevant = trending.filter((collection) => {
        return (
          collection.past_day_volume > 0 &&
          collection.total_volume > 200 &&
          collection.daily_volume > 20
        );
      });
      const truncated = relevant.slice(0, 8);
      // console.log(truncated);
      setTrending(truncated);
    }

    if (collections.length > 0 && solPrice > 0) {
      const totalToday = collections.reduce(
        (sum, collection) => sum + collection.daily_volume,
        0
      );

      const convert = solPrice * totalToday;
      setVolumeTotal(Math.floor(convert));
    }
  }, [collections, solPrice]);

  useEffect(() => {
    if (solPrice === 0) {
      axios.get(links.coingecko.solPrice).then((response) => {
        const price = response.data.solana.usd;
        dispatch(setSolPrice(price));
      });
    }
  }, []);

  return (
    <div className="landing_page d-flex flex-column align-items-center justify-content-center">
      <div>
        <img src={logo} alt="solens_logo" className="homepage_logo img-fluid" />
        {/* <h1 className="text_select">Welcome to Solens</h1> */}
        <h3 className="homepage_tagline mb-3 mb-lg-0">
          Solana's Premiere NFT Data Platform
        </h3>
        <Link to="/collections">
          <button
            className="collection_stat mt-5 mt-lg-4"
            style={{
              border: "1px solid black",
              color: "white",
              marginTop: "20px",
              fontSize: "1.5rem",
            }}
          >
            Explore All Collections
          </button>
        </Link>
      </div>

      <div className="d-flex flex-row flex-wrap col-12 col-xxl-8 justify-content-around">
        <div className="market_stat mt-5">
          <h1>Market Volume</h1>
          <h3>
            ${volumeTotal.toLocaleString()}{" "}
            <span className="collection_stats_days">(24H)</span>
          </h3>
        </div>
        <div className="market_stat mt-5">
          <h1>Solana Price</h1>
          <h3>${solPrice.toLocaleString()}</h3>
        </div>
      </div>

      <div className="landing_page_section col-12 col-xxl-10 mt-5">
        <h1 className="mb-2">Trending Collections</h1>
        <h5 className="collection_stats_days mb-3">LAST 24 HOURS</h5>

        <CollectionSection collections={trending} sort={"daily_change"} />
      </div>

      <Link to="/collections">
        <button
          className="collection_stat mt-5 mb-5"
          style={{
            border: "1px solid black",
            color: "white",
            marginTop: "20px",
            fontSize: "1.5rem",
          }}
        >
          All Collections
        </button>
      </Link>
    </div>
  );
}
