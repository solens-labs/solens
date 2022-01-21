import React, { useEffect, useState } from "react";
import "./style.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTokenMetadata } from "../../utils/getMetadata";
import Walletinfo from "../../components/UserWalletInfo";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import solens_symbol from "../../assets/images//logo3.png";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddress,
  selectAllCollections,
  selectBalance,
  selectUserNFTs,
  setAddress,
  setLoading,
  setUserNFTs,
} from "../../redux/app";
import getTokenAccounts from "../../utils/getTokenAccounts";
import getNftAccounts from "../../utils/getNftAccounts";
import NftCard from "../../components/CardNft/userWallet";
import NftCardListed from "../../components/CardNft/index";
import Loader from "../../components/Loader";
import ReactGA from "react-ga";
import { api } from "../../constants/constants";
import axios from "axios";
import convertWalletActivity from "../../utils/convertActivityWalletData";
import UserActivity from "../../components/UserActivity";
import UserListedItems from "../../components/UserItemsListed";
import UserWalletItems from "../../components/UserItemsWallet";

export default function User(props) {
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const wallet = useWallet();
  const allCollections = useSelector(selectAllCollections);

  const walletBalance = useSelector(selectBalance);
  const walletAddress = useSelector(selectAddress);

  const [listedItems, setListedItems] = useState([]);
  const [walletItems, setWalletItems] = useState([]);
  const [activity, setActivity] = useState([]);

  const [seeActivity, setSeeActivity] = useState(true);
  const [seeAllItems, setSeeAllItems] = useState(false);
  const [currentView, setCurrentView] = useState("activity");

  useEffect(() => {
    if (
      wallet &&
      wallet.connected &&
      wallet.publicKey &&
      allCollections.length > 0 &&
      activity.length === 0
    ) {
      const apiRequest = api.server.walletHistory + wallet.publicKey.toBase58();
      const walletHistory = axios.get(apiRequest).then(async (response) => {
        const activity = response.data;
        const user = wallet.publicKey.toBase58();
        const converted = await convertWalletActivity(
          activity,
          allCollections,
          user
        );
        const resolved = await Promise.all(converted);
        setActivity(resolved);
      });
    }
  }, [wallet, allCollections]);

  // Send user sign in analytics
  useEffect(() => {
    if (wallet && wallet.connected && wallet.publicKey) {
      ReactGA.event({
        category: "User",
        action: "Login",
        label: wallet.publicKey.toBase58(),
      });
    }
  }, [wallet]);

  // Get wallet token accounts, filter for NFTs, and fetch/set metadata
  useEffect(async () => {
    if (wallet && wallet.connected && wallet.publicKey) {
      const userTokenAccts = await getTokenAccounts(wallet, connection);
      const userNftTokenAccts = getNftAccounts(userTokenAccts);
      const nftMetadataPromise = userNftTokenAccts.map(async (token, i) => {
        return await getTokenMetadata(token.mint);
      });
      const nftMetadata = await Promise.all(nftMetadataPromise);
      // dispatch(setUserNFTs(nftMetadata));
      setWalletItems(nftMetadata);
    }

    if (!wallet.connected || (wallet.disconnecting && walletItems.length > 0)) {
      // dispatch(setUserNFTs([]));
      setWalletItems([]);
      dispatch(setAddress(""));
    }
  }, [wallet]);

  // Get listed items and fetch/set metadata
  useEffect(async () => {
    if (wallet && wallet.connected && wallet.publicKey) {
      const apiRequest =
        api.server.walletListings + wallet.publicKey.toBase58();
      const fetchListed = axios.get(apiRequest).then(async (response) => {
        const items = response.data;
        const nftMetadataPromise = items.map(async (item, i) => {
          const promise = await getTokenMetadata(item?.mint);
          const tokenMD = await Promise.resolve(promise);
          tokenMD["list_price"] = item?.price;
          tokenMD["list_mp"] = item?.marketplace;
          tokenMD["owner"] = item?.owner;
          return tokenMD;
        });
        const nftMetadata = await Promise.all(nftMetadataPromise);

        setListedItems(nftMetadata);
      });
    }

    if (!wallet.connected || (wallet.disconnecting && walletItems.length > 0)) {
      setListedItems([]);
    }
  }, [wallet]);

  return (
    <div className="col-12 d-flex flex-column align-items-center mt-4">
      <div className="col-12 d-flex justify-content-center">
        {!wallet.connected && (
          <div className="d-flex flex-column align-items-center">
            <h2 className="mt-5">Connect to view your profile</h2>
            <WalletMultiButton
              className="connect_button"
              style={{
                border: "1px solid black",
                color: "white",
                borderRadius: 15,
              }}
            />
          </div>
        )}
      </div>

      {wallet.connected && window.innerWidth < 990 && (
        <div className="col-12 d-flex justify-content-center mb-3">
          <div className="d-flex flex-column align-items-center">
            <WalletMultiButton
              className="connect_button"
              style={{
                border: "1px solid black",
                color: "white",
                borderRadius: 15,
              }}
            />
          </div>
        </div>
      )}

      {/* {wallet.connected && (
        <div className="col-12 d-flex flex-column align-items-center">
          <h1>User Profile</h1>
        </div>
      )} */}

      {wallet.connected && (
        <div className="col-12 col-lg-8 col-xl-6 d-flex flex-row flex-wrap justify-content-center mb-3">
          <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`${
                currentView === "activity"
                  ? "btn_color_outside"
                  : "btn_color_selected"
              } btn-button btn-tall btn-wide d-flex mt-2 mb-2`}
              onClick={() => {
                setCurrentView("activity");
              }}
            >
              {currentView === "activity" && (
                <div className="btn_color_inner">Activity</div>
              )}
              {currentView !== "activity" && "Activity"}
            </div>
          </div>

          <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`${
                currentView === "listed"
                  ? "btn_color_outside"
                  : "btn_color_selected"
              } btn-button btn-tall btn-wide d-flex mt-2 mb-2`}
              onClick={() => {
                setCurrentView("listed");
              }}
            >
              {currentView === "listed" && (
                <div className="btn_color_inner">Listed</div>
              )}
              {currentView !== "listed" ? "Listed" : ""}
            </div>
          </div>

          <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`${
                currentView === "wallet"
                  ? "btn_color_outside"
                  : "btn_color_selected"
              } btn-button btn-tall btn-wide d-flex mt-2 mb-2`}
              onClick={() => {
                setCurrentView("wallet");
              }}
            >
              {currentView === "wallet" && (
                <div className="btn_color_inner">Wallet</div>
              )}
              {currentView !== "wallet" ? "Wallet" : ""}
            </div>
          </div>
        </div>
      )}

      {wallet.connected && currentView === "listed" && (
        <UserListedItems listedItems={listedItems} />
      )}

      {wallet.connected && currentView === "wallet" && (
        <UserWalletItems walletItems={walletItems} />
      )}

      {wallet.connected && currentView === "activity" && (
        <UserActivity activity={activity} />
      )}
    </div>
  );
}
