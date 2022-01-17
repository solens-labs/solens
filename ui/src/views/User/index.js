import React, { useEffect, useState } from "react";
import "./style.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTokenMetadata } from "../../utils/getMetadata";
import Walletinfo from "../../components/WalletInfo";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import solens_symbol from "../../assets/images//logo3.png";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddress,
  selectBalance,
  selectUserNFTs,
  setAddress,
  setLoading,
  setUserNFTs,
} from "../../redux/app";
import getTokenAccounts from "../../utils/getTokenAccounts";
import getNftAccounts from "../../utils/getNftAccounts";
import NftCard from "../../components/NftCard/userprofile";
import NftCardListed from "../../components/NftCard/index";
import { useHistory } from "react-router-dom";
import { shortenAddress } from "../../candy-machine";
import Loader from "../../components/Loader";
import ReactGA from "react-ga";
import { api } from "../../constants/constants";
import axios from "axios";

export default function User(props) {
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const history = useHistory();
  const wallet = useWallet();

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

  // Send user sign in analytics
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      ReactGA.event({
        category: "User",
        action: "Login",
        label: wallet.publicKey,
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
    if (wallet.connected && wallet.publicKey) {
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
    if (wallet.connected && wallet.publicKey) {
      setLoadedListed(false);
      const apiRequest =
        api.server.walletListings + wallet.publicKey.toBase58();
      const fetchListed = axios.get(apiRequest).then(async (response) => {
        const items = response.data;
        console.log(items);
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

  // Toggle between listed/unlisted
  const toggleItems = () => {
    setSeeAllItems(!seeAllItems);
  };

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
          <div className="col-12 d-flex justify-content-center mt-2">
            <Walletinfo
              address={walletAddress}
              balance={walletBalance}
              nfts={nfts.length}
              listed={listedItems.length}
            />
          </div>
        </div>
      )}

      {wallet.connected && (
        <div className="col-12 col-lg-8 col-xl-6 col-xxl-5 d-flex flex-row flex-wrap justify-content-center mb-3">
          <div className="col-6 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`btn-button btn-tall btn-wide ${
                seeAllItems ? "btn_color_selected" : "btn_color_outside"
              } d-flex mt-2 mb-2`}
              onClick={() => setSeeAllItems(false)}
            >
              {!seeAllItems && (
                <div className="btn_color_inner">Listed Items</div>
              )}
              {seeAllItems && "Listed Items"}
            </div>
          </div>
          <div className="col-6 p-1 p-lg-3 pt-0 pb-0">
            <div
              className={`btn-button btn-tall btn-wide ${
                !seeAllItems ? "btn_color_selected" : "btn_color_outside"
              } d-flex mt-2 mb-2`}
              onClick={() => setSeeAllItems(true)}
            >
              {seeAllItems && (
                <div className="btn_color_inner">Wallet Items</div>
              )}
              {!seeAllItems && "Wallet Items"}
            </div>
          </div>
        </div>
      )}

      {!seeAllItems && (
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
      )}

      {seeAllItems && (
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
      )}
    </div>
  );
}
