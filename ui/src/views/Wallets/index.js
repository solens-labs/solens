import React, { useEffect, useState } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import {
  selectDailyVolume,
  selectWeeklyVolume,
  selectWalletBuyers,
  selectWalletBuyersDay,
  selectWalletSellers,
  selectWalletSellersDay,
} from "../../redux/app";
import WalletsSection from "../../components/WalletsPageSection";
import Timeframe from "../../components/Timeframe";
import { Helmet } from "react-helmet";

export default function Wallets(props) {
  const walletBuyersAll = useSelector(selectWalletBuyers);
  const walletSellersAll = useSelector(selectWalletSellers);
  const walletBuyersDay = useSelector(selectWalletBuyersDay);
  const walletSellersDay = useSelector(selectWalletSellersDay);
  const volumeDay = useSelector(selectDailyVolume);
  const volumeWeek = useSelector(selectWeeklyVolume);

  const [timeframe, setTimeframe] = useState(1);
  const [volume, setVolume] = useState(volumeDay);
  const [buyers, setBuyers] = useState(walletBuyersDay);
  const [sellers, setSellers] = useState(walletSellersDay);

  useEffect(() => {
    switch (timeframe) {
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
  }, [timeframe]);

  useEffect(() => {
    setVolume(volumeDay);
    setBuyers(walletBuyersDay);
    setSellers(walletSellersDay);
  }, [walletBuyersDay, walletSellersDay, volumeDay]);

  return (
    <div className="d-flex flex-wrap flex-column align-items-center justify-content-center col-12 mt-4 mb-5">
      <Helmet>
        <title>Solens - Wallets</title>
        <meta
          name="description"
          content="View the largest buyers and sellers of Solana NFTs. Follow smart money. Find the next big opportunity."
        />
      </Helmet>

      <h1 className="mb-2">Wallet Analysis</h1>
      <div className="d-flex flex-wrap flex-row justify-content-around col-8 col-md-6 col-lg-4 col-xxl-2 mb-3">
        <Timeframe
          currentTimeframe={timeframe}
          setTimeframe={setTimeframe}
          timeframes={["DAY", "ALL"]}
          intervals={[1, 10000]}
        />
      </div>

      <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

      <WalletsSection buyers={buyers} sellers={sellers} volume={volume} />
    </div>
  );
}
