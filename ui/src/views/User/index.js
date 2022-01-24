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
import ReactGA from "react-ga";
import { api } from "../../constants/constants";
import axios from "axios";
import convertUserActivity from "../../utils/convertActivityUserData";
import UserActivity from "../../components/UserActivity";
import UserListedItems from "../../components/UserItemsListed";
import UserWalletItems from "../../components/UserItemsWallet";
import { fetchItemsMetadata } from "../../utils/getItemsMetadata";

export default function User(props) {
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const wallet = useWallet();
  const allCollections = useSelector(selectAllCollections);

  const walletBalance = useSelector(selectBalance);
  const walletAddress = useSelector(selectAddress);

  const [activity, setActivity] = useState([]);
  const [walletItems, setWalletItems] = useState([]);
  const [listedItems, setListedItems] = useState([]);
  const [listedItemsMetadata, setlistedItemsMetadata] = useState([]);
  const [walletItemsMetadata, setWalletItemsMetadata] = useState([]);

  const [currentView, setCurrentView] = useState("listed");

  // Get user activity
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
        const converted = await convertUserActivity(
          activity,
          allCollections,
          user
        );
        const resolved = await Promise.all(converted);
        setActivity(resolved);
      });
    }
  }, [wallet, allCollections]);

  // Get wallet token accounts, filter for NFTs, and fetch/set metadata
  useEffect(async () => {
    if (wallet && wallet.connected && wallet.publicKey) {
      const userTokenAccts = await getTokenAccounts(wallet, connection);
      const userNftTokenAccts = getNftAccounts(userTokenAccts);
      setWalletItems(userNftTokenAccts);
      const intitialItems = userNftTokenAccts.slice(0, 20);
      const intitialMetadata = await fetchItemsMetadata([], intitialItems);
      setWalletItemsMetadata(intitialMetadata);
    }
  }, [wallet]);

  // Get listed items and fetch/set metadata
  useEffect(async () => {
    if (wallet && wallet.connected && wallet.publicKey) {
      const apiRequest =
        api.server.walletListings + wallet.publicKey.toBase58();
      const fetchListed = axios.get(apiRequest).then(async (response) => {
        const items = response.data;
        setListedItems(items);
        const intitialItems = items.slice(0, 20);
        const intitialMetadata = await fetchItemsMetadata([], intitialItems);
        setlistedItemsMetadata(intitialMetadata);
      });
    }
  }, [wallet]);

  // Clear component state on wallet disconnect
  useEffect(() => {
    if ((!wallet.connected || wallet.disconnecting) && walletItems.length > 0) {
      // dispatch(setUserNFTs([]));
      // dispatch(setAddress(""));
      setListedItems([]);
      setWalletItems([]);
      setlistedItemsMetadata([]);
      setWalletItemsMetadata([]);
    }
  }, [wallet]);

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
        <UserListedItems
          listedItems={listedItems}
          listedItemsMetadata={listedItemsMetadata}
          setlistedItemsMetadata={setlistedItemsMetadata}
        />
      )}

      {wallet.connected && currentView === "wallet" && (
        <UserWalletItems
          walletItems={walletItems}
          walletItemsMetadata={walletItemsMetadata}
          setWalletItemsMetadata={setWalletItemsMetadata}
        />
      )}

      {wallet.connected && currentView === "activity" && (
        <UserActivity activity={activity} />
      )}
    </div>
  );
}
