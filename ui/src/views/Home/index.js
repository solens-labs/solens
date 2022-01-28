import { useEffect, useState } from "react";
import "./style.css";
import logo from "../../assets/images/logo2.png";
import { Link, useHistory } from "react-router-dom";
import CollectionSection from "../../components/SectionCollection";
import { useSelector } from "react-redux";
import {
  selectAllCollections,
  selectSolPrice,
  selectWalletBuyers,
  selectWalletBuyersDay,
  selectWalletSellers,
  selectWalletSellersDay,
  selectDailyVolume,
  selectWeeklyVolume,
  selectTopNFTsDay,
} from "../../redux/app";
import Loader from "../../components/Loader";
import NftCard from "../../components/CardNft/homepage";
import launchzone from "../../assets/images/launchzone.png";
import solana from "../../assets/images/solana.svg";
import collections_gif from "../../assets/images/collections.gif";
import solens_logo from "../../assets/images/logo2.png";
import { Helmet } from "react-helmet";
import { themeColors } from "../../constants/constants";
import { launch_collections } from "../../constants/launchzone";
import UpcomingCollection from "../../components/CardCollection/upcoming";
import { upcoming_collections } from "../../constants/emptySections";

export default function HomePage(props) {
  const history = useHistory();
  const collections = useSelector(selectAllCollections);
  const walletBuyersAll = useSelector(selectWalletBuyers);
  const walletBuyersDay = useSelector(selectWalletBuyersDay);
  const walletSellersAll = useSelector(selectWalletSellers);
  const walletSellersDay = useSelector(selectWalletSellersDay);
  const [trending, setTrending] = useState([]);
  const solPrice = useSelector(selectSolPrice);
  const volumeDay = useSelector(selectDailyVolume);
  const volumeWeek = useSelector(selectWeeklyVolume);
  const topNFTs = useSelector(selectTopNFTsDay);

  const [walletsTimeframe, setWalletsTimeframe] = useState(1);
  const [volume, setVolume] = useState(volumeDay);
  const [buyers, setBuyers] = useState(walletBuyersDay);
  const [sellers, setSellers] = useState(walletSellersDay);

  // Wallets timeframe switching
  useEffect(() => {
    switch (walletsTimeframe) {
      case 1:
        setVolume(volumeDay);
        setBuyers(walletBuyersDay);
        setSellers(walletSellersDay);
        break;
      case 10000:
        setVolume(volumeWeek);
        setBuyers(walletBuyersAll);
        setSellers(walletSellersAll);
        break;
    }
  }, [walletsTimeframe]);

  // Set the default wallets timeframe
  useEffect(() => {
    setVolume(volumeDay);
    setBuyers(walletBuyersDay);
    setSellers(walletSellersDay);
  }, [walletBuyersDay, walletSellersDay, volumeDay]);

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

  const visitLaunchzone = () => {
    history.push("/launch");
  };
  const visitProfile = () => {
    history.push("/user");
  };

  return (
    <div className="landing_page col-12 d-flex flex-column align-items-center justify-content-center mb-5">
      <Helmet>
        <title>Solens - Solana NFT Marketplex</title>
        <meta
          name="description"
          content="Premier NFT Marketplex on Solana. Discover NFT collections, get in-depth analytics, and trade across multiple marketplaces."
        />
      </Helmet>

      <div className="main_header">
        <img src={logo} className="homepage_logo img-fluid" alt="solens logo" />
        <h3 className="homepage_tagline mb-2">
          Solana's Premier NFT Marketplex
        </h3>
        <Link to="/collections">
          <button
            className="explore_all_button"
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

      <div className="main_stats d-flex flex-row flex-wrap col-12 col-xxl-8 justify-content-around">
        <div className="market_stat mt-5">
          <h1>Market Volume</h1>

          <h3>
            ${volumeDay && volumeDay.toLocaleString()}{" "}
            <span className="collection_stats_days">(24H)</span>
          </h3>
        </div>
        <div className="market_stat mt-5">
          <h1>Solana Price</h1>
          <h3>
            $
            {solPrice.toLocaleString("en", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
      </div>

      <div className="trade_now tradezone_image_bg d-flex flex-wrap justify-content-center align-items-center col-12 col-xxl-10 mt-5 m-0 p-0 overflow-hidden">
        <div className="col-12 col-xl-4 d-flex flex-row justify-content-center">
          <img
            src={collections_gif}
            alt="launchzone_logo"
            className="collections_gif mt-5 mt-lg-0"
          />
        </div>

        <div className="blackground col-12 col-xl-6 mt-5 mb-5 d-flex flex-column align-items-center">
          <h5 style={{ fontSize: "1.7rem" }}>
            Trade NFTs on Magic Eden and Solanart
          </h5>

          <h3 className="mt-4 mt-lg-3" style={{ fontSize: "2.2rem" }}>
            Directly on{" "}
            <span>
              <img
                src={solens_logo}
                style={{ height: 50, marginBottom: 17 }}
                alt="Solens"
              />
            </span>
          </h3>

          <button
            className="apply_launchzone explore_all_button mt-3 mb-2 btn-large"
            style={{
              border: "1px solid black",
              color: "white",
              width: "70%",
              fontSize: "1.5rem",
              fontWeight: 800,
            }}
            onClick={visitProfile}
          >
            TRADE
          </button>
        </div>
      </div>

      <div className="launchzone_collections landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5 overflow-hidden">
        <h1 className="mb-2">Upcoming Launches</h1>
        <h5 className="collection_stats_days">
          on the{" "}
          <span>
            <Link
              to="/launch"
              style={{ textDecoration: "none", color: themeColors[0] }}
            >
              Solens Launchzone
            </Link>
          </span>
        </h5>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        <div className="d-flex flex-wrap justify-content-around col-12 mt-lg-3 mb-4">
          {launch_collections.map((collection, i) => {
            return (
              <UpcomingCollection
                collection={collection}
                key={i}
                onClick={visitLaunchzone}
              />
            );
          })}
        </div>

        <Link to="/launch">
          <button
            className="explore_all_button mt-3 mb-3"
            style={{
              border: "1px solid black",
              color: "white",
              marginTop: "20px",
              fontSize: "1.5rem",
            }}
          >
            Explore Launchzone
          </button>
        </Link>
      </div>

      <div className="top_nfts landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5 overflow-hidden">
        <h1 className="mb-2">Top Traded NFTs</h1>
        <h5 className="collection_stats_days">LAST 24 HOURS</h5>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        <div className="d-flex flex-wrap justify-content-around col-12 mt-lg-3">
          {topNFTs.length !== 0 ? (
            topNFTs.map((item, i) => {
              return <NftCard item={item} />;
            })
          ) : (
            <Loader />
          )}
        </div>
      </div>

      <div className="trending_collections landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5">
        <h1 className="mb-2">Trending Collections</h1>
        <h5 className="collection_stats_days">LAST 24 HOURS</h5>
        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        {trending.length !== 0 ? (
          <CollectionSection collections={trending} sort={"daily_change"} />
        ) : (
          <Loader />
        )}

        <Link to="/collections">
          <button
            className="explore_all_button mt-3 mb-3"
            style={{
              border: "1px solid black",
              color: "white",
              marginTop: "20px",
              fontSize: "1.5rem",
            }}
          >
            Explore Collections
          </button>
        </Link>
      </div>

      <div className="launchzone_section landing_page_section launchzone_image_bg d-flex flex-column align-items-center col-12 col-xxl-10 mt-5 overflow-hidden">
        <img
          src={launchzone}
          alt="launchzone_logo"
          className="img-fluid"
          style={{ maxHeight: "150px", margin: 0, padding: 0 }}
        />

        <div className="blackground col-12 col-sm-11 col-md-9 col-xxl-6 mt-4 mb-5">
          <h5>
            Looking to launch your own NFT collection on{" "}
            <span>
              <img
                src={solana}
                style={{ height: "1rem", paddingBottom: 4 }}
                alt="solana logo"
              />
            </span>
            ?
          </h5>

          <h3 className="mt-3">Apply for our NFT launchpad</h3>

          <button
            className="apply_launchzone explore_all_button mt-2 mb-2"
            style={{
              border: "1px solid black",
              color: "white",
            }}
            onClick={visitLaunchzone}
          >
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
