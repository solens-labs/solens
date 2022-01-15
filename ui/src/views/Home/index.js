import { useEffect, useState } from "react";
import "./style.css";
import logo from "../../assets/images/logo2.png";
import { Link, useHistory } from "react-router-dom";
import CollectionSection from "../../components/CollectionSection";
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
import Timeframe from "../../components/Timeframe";
import WalletsHomeSection from "../../components/WalletsHomeSection";
import NftCard from "../../components/NftCard/homepage";
import launchzone from "../../assets/images/launchzone.png";
import solana from "../../assets/images/solana.svg";

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

  return (
    <div className="landing_page col-12 d-flex flex-column align-items-center justify-content-center mb-5">
      <div className="main_header">
        <img src={logo} alt="solens_logo" className="homepage_logo img-fluid" />
        <h3 className="homepage_tagline mb-2">
          Solana's Premiere NFT Data Platform
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

      <div className="top_wallets landing_page_section d-flex flex-column align-items-center col-12 col-xxl-10 mt-5 overflow-hidden">
        <h1 className="mb-2">Wallet Analysis</h1>
        <div className="d-flex flex-wrap flex-row justify-content-around col-8 col-md-6 col-lg-4 col-xxl-3 mb-3">
          <Timeframe
            currentTimeframe={walletsTimeframe}
            setTimeframe={setWalletsTimeframe}
            timeframes={["DAY", "ALL"]}
            intervals={[1, 10000]}
          />
        </div>

        <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

        <WalletsHomeSection buyers={buyers} sellers={sellers} volume={volume} />

        <Link to="/wallets">
          <button
            className="explore_all_button mt-3 mb-3"
            style={{
              border: "1px solid black",
              color: "white",
              marginTop: "20px",
              fontSize: "1.5rem",
            }}
          >
            Explore Wallets
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
              <img src={solana} style={{ height: "1rem", paddingBottom: 4 }} />
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
