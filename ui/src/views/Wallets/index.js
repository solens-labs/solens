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
import WalletsSection from "../../components/WalletsSection";
import Timeframe from "../../components/Timeframe";

export default function Wallets(props) {
  const walletBuyersWeek = useSelector(selectWalletBuyers);
  const walletSellersWeek = useSelector(selectWalletSellers);
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
      case 7:
        setVolume(volumeWeek);
        setBuyers(walletBuyersWeek);
        setSellers(walletSellersWeek);
        break;
    }
  }, [timeframe]);

  useEffect(() => {
    setVolume(volumeDay);
    setBuyers(walletBuyersDay);
    setSellers(walletSellersDay);
  }, [walletBuyersDay, walletSellersDay, volumeDay]);

  return (
    <div className="d-flex flex-wrap flex-column align-items-center justify-content-center col-12 mt-2">
      <h1 className="mb-2">Top Wallets</h1>
      <div className="d-flex flex-wrap flex-row justify-content-around col-8 col-md-6 col-lg-4 col-xxl-2 mb-3">
        <Timeframe
          currentTimeframe={timeframe}
          setTimeframe={setTimeframe}
          timeframes={["DAY", "WEEK"]}
          intervals={[1, 7]}
        />
      </div>

      <hr style={{ color: "white", width: "50%" }} className="mt-0 mb-4" />

      <WalletsSection buyers={buyers} sellers={sellers} volume={volume} />
    </div>
  );
}
