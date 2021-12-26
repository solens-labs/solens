import React, { useEffect, useState } from "react";
import "./style.css";
import logo from "../../assets/images/logo2.png";
import { Link } from "react-router-dom";
import CollectionSection from "../../components/CollectionSection";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCollections,
  selectSolPrice,
  selectWalletBuyers,
  selectWalletBuyersDay,
  selectWalletSellers,
  selectWalletSellersDay,
  setDailyVolume,
  selectDailyVolume,
  selectWeeklyVolume,
} from "../../redux/app";
import WalletCard from "../../components/WalletCard";
import Loader from "../../components/Loader";

export default function LandingPage(props) {
  const dispatch = useDispatch();
  const collections = useSelector(selectAllCollections);
  const walletBuyers = useSelector(selectWalletBuyers);
  const walletBuyersDay = useSelector(selectWalletBuyersDay);
  const walletSellers = useSelector(selectWalletSellers);
  const walletSellersDay = useSelector(selectWalletSellersDay);
  const [trending, setTrending] = useState([]);
  const solPrice = useSelector(selectSolPrice);
  const volumeDay = useSelector(selectDailyVolume);
  const volumeWeek = useSelector(selectWeeklyVolume);

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
      setTrending(truncated);
    }
  }, [collections, solPrice]);

  return (
    <div className="landing_page d-flex flex-column align-items-center justify-content-center">
      <div>
        <img src={logo} alt="solens_logo" className="homepage_logo img-fluid" />
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
            ${volumeDay && volumeDay.toLocaleString()}{" "}
            <span className="collection_stats_days">(24H)</span>
          </h3>
        </div>
        <div className="market_stat mt-5">
          <div className="d-flex col-12 justify-content-center">
            <h1>Solana Price</h1>
          </div>
          <h3>
            $
            {solPrice.toLocaleString("en", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
      </div>

      <div className="landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5">
        <h1 className="mb-2">Trending Collections</h1>
        <h5 className="collection_stats_days">LAST 24 HOURS</h5>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        {trending.length !== 0 ? (
          <CollectionSection collections={trending} sort={"daily_change"} />
        ) : (
          <Loader />
        )}
      </div>

      <div className="landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5 overflow-hidden">
        <h1 className="mb-2">Top Wallets</h1>
        <h5 className="collection_stats_days">LAST 24 HOURS</h5>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        <div className="d-flex flex-row flex-wrap justify-content-center col-12">
          <div className="d-flex flex-column align-items-center col-12 col-lg-6">
            <h5
              className="collection_stats_days font_white mt-2 mb-3"
              style={{ fontSize: "1.5rem" }}
            >
              TOP BUYERS
            </h5>

            <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
              {walletBuyersDay.length === 0 && <Loader />}
              {walletBuyersDay.map((wallet, i) => {
                if (i <= 1) {
                  return (
                    <div
                      key={i}
                      className="col-12 col-md-6 d-flex flex-wrap justify-content-center mb-4"
                    >
                      <WalletCard
                        data={wallet}
                        type="BUYS"
                        volume={volumeDay}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="d-flex flex-column align-items-center col-12 col-lg-6">
            <h5
              className="collection_stats_days font_white mt-2 mb-3"
              style={{ fontSize: "1.5rem" }}
            >
              TOP SELLERS
            </h5>

            <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
              {walletSellersDay.length === 0 && <Loader />}

              {walletSellersDay.map((wallet, i) => {
                if (i <= 1) {
                  return (
                    <div
                      key={i}
                      className="col-12 col-md-6 d-flex flex-wrap justify-content-center mb-4"
                    >
                      <WalletCard
                        data={wallet}
                        type="SALES"
                        volume={volumeDay}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5">
        <h1 className="mb-2">Top Wallets</h1>
        <h5 className="collection_stats_days">LAST 7 DAYS</h5>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        <div className="d-flex flex-row flex-wrap justify-content-center col-12">
          <div className="d-flex flex-column align-items-center col-12 col-lg-6">
            <h5
              className="collection_stats_days font_white mt-2 mb-3"
              style={{ fontSize: "1.5rem" }}
            >
              TOP BUYERS
            </h5>

            <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
              {walletBuyers.length === 0 && <Loader />}
              {walletBuyers.map((wallet, i) => {
                if (i <= 1) {
                  return (
                    <div
                      key={i}
                      className="col-12 col-md-6 d-flex flex-wrap justify-content-center mb-4"
                    >
                      <WalletCard
                        data={wallet}
                        type={"BUYS"}
                        volume={volumeWeek}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="d-flex flex-column align-items-center col-12 col-lg-6">
            <h5
              className="collection_stats_days font_white mt-2 mb-3"
              style={{ fontSize: "1.5rem" }}
            >
              TOP SELLERS
            </h5>

            <div className="d-flex flex-row flex-wrap col-12 justify-content-center mb-4">
              {walletSellers.length === 0 && <Loader />}

              {walletSellers.map((wallet, i) => {
                if (i <= 1) {
                  return (
                    <div
                      key={i}
                      className="col-12 col-md-6 d-flex flex-wrap justify-content-center mb-4"
                    >
                      <WalletCard
                        data={wallet}
                        type={"SALES"}
                        volume={volumeWeek}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
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
