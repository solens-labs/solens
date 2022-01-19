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
import NftCard from "../../components/CardNft/userprofile";
import NftCardListed from "../../components/CardNft/index";
import Loader from "../../components/Loader";
import ReactGA from "react-ga";
import { api } from "../../constants/constants";
import axios from "axios";
import convertWalletActivity from "../../utils/convertActivityWalletData";
import ActivityTable from "../../components/TableActivityWallet";

export default function User(props) {
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const wallet = useWallet();
  const allCollections = useSelector(selectAllCollections);

  const walletBalance = useSelector(selectBalance);
  const walletAddress = useSelector(selectAddress);
  // const nfts = useSelector(selectUserNFTs);
  const [nfts, setNfts] = useState([]);
  // const [walletAddress, setWalletAddress] = useState("");
  const [listedItems, setListedItems] = useState([]);
  // const [toggleItemView, setToggleItemView] = useState("wallet");
  const [seeAllItems, setSeeAllItems] = useState(false);
  const [loadedItems, setLoadedItems] = useState(false);
  const [loadedListed, setLoadedListed] = useState(false);
  const [activity, setActivity] = useState([]);
  const [seeActivity, setSeeActivity] = useState(true);

  useEffect(() => {
    if (
      wallet &&
      wallet.connected &&
      wallet.publicKey &&
      allCollections.length > 0 &&
      activity.length === 0
    ) {
      const apiRequest = api.server.walletHistory + wallet.publicKey.toBase58();
      const walletHistory = axios.get(apiRequest).then((response) => {
        const activity = response.data;
        const user = wallet.publicKey.toBase58();
        const converted = convertWalletActivity(activity, allCollections, user);
        console.log({ converted });
        setActivity(converted);
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

  // Check if NFTs have already been fetched previously
  useEffect(() => {
    if (nfts.length > 0) {
      setLoadedItems(true);
    }
  }, [nfts]);

  // Get wallet token accounts, filter for NFTs, and fetch/set metadata
  useEffect(async () => {
    if (wallet && wallet.connected && wallet.publicKey) {
      setLoadedItems(false);
      const userTokenAccts = await getTokenAccounts(wallet, connection);
      const userNftTokenAccts = getNftAccounts(userTokenAccts);
      const nftMetadataPromise = userNftTokenAccts.map(async (token, i) => {
        return await getTokenMetadata(token.mint);
      });
      const nftMetadata = await Promise.all(nftMetadataPromise);
      // dispatch(setUserNFTs(nftMetadata));
      setNfts(nftMetadata);
      setLoadedItems(true);
    }

    if (!wallet.connected || (wallet.disconnecting && nfts.length > 0)) {
      // dispatch(setUserNFTs([]));
      setNfts([]);
      dispatch(setAddress(""));
      setLoadedItems(false);
    }
  }, [wallet]);

  // Get listed items and fetch/set metadata
  useEffect(async () => {
    if (wallet && wallet.connected && wallet.publicKey) {
      setLoadedListed(false);
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
        setLoadedListed(true);
      });
    }

    if (!wallet.connected || (wallet.disconnecting && nfts.length > 0)) {
      setListedItems([]);
      setLoadedListed(false);
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

      {wallet.connected && (
        <div className="col-12 d-flex flex-column align-items-center">
          <h1>User Profile</h1>
          {/* <div className="col-12 d-flex justify-content-center mt-2">
            <Walletinfo
              address={walletAddress}
              balance={walletBalance}
              nfts={nfts.length}
              listed={listedItems.length}
            />
          </div> */}
        </div>
      )}

      {wallet.connected && (
        <div className="col-12 col-lg-8 col-xl-6 d-flex flex-row flex-wrap justify-content-center mb-3">
          <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`btn-button btn-tall btn-wide ${
                seeAllItems && !seeActivity
                  ? "btn_color_selected"
                  : "btn_color_outside"
              } d-flex mt-2 mb-2`}
              onClick={() => {
                setSeeAllItems(false);
                setSeeActivity(false);
              }}
            >
              {!seeAllItems && !seeActivity && (
                <div className="btn_color_inner">Listed</div>
              )}
              {seeAllItems || seeActivity ? "Listed" : ""}
            </div>
          </div>

          <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`btn-button btn-tall btn-wide ${
                !seeAllItems && !seeActivity
                  ? "btn_color_selected"
                  : "btn_color_outside"
              } d-flex mt-2 mb-2`}
              onClick={() => {
                setSeeAllItems(true);
                setSeeActivity(false);
              }}
            >
              {seeAllItems && !seeActivity && (
                <div className="btn_color_inner">Wallet</div>
              )}
              {!seeAllItems || seeActivity ? "Wallet" : ""}
            </div>
          </div>

          <div className="col-4 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`btn-button btn-tall btn-wide ${
                !seeActivity ? "btn_color_selected" : "btn_color_outside"
              } d-flex mt-2 mb-2`}
              onClick={() => {
                setSeeActivity(true);
              }}
            >
              {seeActivity && <div className="btn_color_inner">Activity</div>}
              {!seeActivity && "Activity"}
            </div>
          </div>
        </div>
      )}

      {!seeAllItems && !seeActivity && (
        <>
          <div className="stat_container col-12 col-lg-3 p-2">
            <div className="stat p-2">
              <h2>{listedItems.length} Listed Items</h2>
              {/* <h4>On Exchanges</h4> */}
            </div>
          </div>
          <div className="col-12 col-xxl-10 d-flex flex-row flex-wrap justify-content-center mt-4">
            {listedItems.length > 0 &&
              listedItems.map((item, i) => {
                return (
                  <div
                    className="nft_grid_card col-12 col-sm-8 col-md-6 col-xl-4 col-xxl-3 p-2 p-lg-3"
                    key={i}
                  >
                    <NftCardListed item={item} links={""} />
                  </div>
                );
              })}

            <div className="mt-5">
              {wallet.connected && !loadedListed && <Loader />}
            </div>
          </div>
        </>
      )}

      {seeAllItems && !seeActivity && (
        <>
          <div className="stat_container col-12 col-lg-3 p-2">
            <div className="stat p-2">
              <h2>{nfts.length} Unlisted Items</h2>
              {/* <h4>In Wallet</h4> */}
            </div>
          </div>

          <div className="col-12 col-xxl-10 d-flex flex-row flex-wrap justify-content-center mt-4">
            {nfts.length > 0 &&
              nfts.map((item, i) => {
                return (
                  <div
                    className="nft_grid_card col-12 col-sm-8 col-md-6 col-xl-4 col-xxl-3 p-2 p-lg-3"
                    key={i}
                  >
                    <NftCard item={item} links={""} />
                  </div>
                );
              })}

            <div className="mt-5">
              {wallet.connected && !loadedItems && <Loader />}
            </div>
          </div>
        </>
      )}

      {wallet.connected && seeActivity && (
        <>
          <div className="stat_container col-12 col-lg-3 p-2">
            <div className="stat p-2">
              <h2>Recent Activity</h2>
            </div>
          </div>
          <div className="chartbox col-12 col-lg-10 d-flex flex-row flex-wrap justify-content-center mt-4">
            <ActivityTable data={activity} />
          </div>
        </>
      )}
    </div>
  );
}
