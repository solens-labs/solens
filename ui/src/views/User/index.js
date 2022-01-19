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
import Loader from "../../components/Loader";
import ReactGA from "react-ga";
import { api } from "../../constants/constants";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

export default function User(props) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const walletBalance = useSelector(selectBalance);
  const walletAddress = useSelector(selectAddress);

  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true); // needed for infinite scroll end

  const [walletItems, setWalletItems] = useState([]);
  const [listedItems, setListedItems] = useState([]);
  const [seeAllItems, setSeeAllItems] = useState(false);

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

  // Get wallet items
  useEffect(async () => {
    if (wallet.connected && wallet.publicKey && walletItems.length === 0) {
      const userTokenAccts = await getTokenAccounts(wallet, connection);
      const userNftTokenAccts = getNftAccounts(userTokenAccts);
      setWalletItems(userNftTokenAccts);
    }
  }, [wallet, walletItems]);

  // Get listed items
  useEffect(async () => {
    if (wallet.connected && wallet.publicKey && listedItems.length === 0) {
      const apiRequest =
        api.server.walletListings + wallet.publicKey.toBase58();
      const fetchListed = axios.get(apiRequest).then(async (response) => {
        const items = response.data;
        setListedItems(items);
      });
    }
  }, [wallet, listedItems]);

  // Handle disconnect
  useEffect(() => {
    if (
      !wallet.connected ||
      (wallet.disconnecting && walletItems.length > 0) ||
      (wallet.disconnecting && listedItems.length > 0)
    ) {
      setListedItems([]);
      setWalletItems([]);
      setItems([]);
    }
  }, [wallet]);

  // Toggle between Listed Items & All Items
  useEffect(async () => {
    setItems([]);
    if (!seeAllItems && listedItems.length > 0 && items.length === 0) {
      const initialItems = await setInitialItems(listedItems);
      setItems(initialItems);
      return;
    }

    if (!seeAllItems && listedItems.length > 0) {
      const initialItems = await setInitialItems(listedItems);
      setItems(initialItems);
      return;
    }

    if (seeAllItems && walletItems.length > 0) {
      const initialItems = await setInitialItems(walletItems);
      setItems(initialItems);
      return;
    }
  }, [seeAllItems, walletItems, listedItems]);

  // Set the first 20 for toggle
  const setInitialItems = async (allItems) => {
    const intitialItems = allItems.slice(0, 10);
    const intitialItemsMetadata = await fetchItemsMetadata([], intitialItems);
    return intitialItemsMetadata;
  };

  // Infinite scroll data fetcher
  const fetchAndSetItems = async (items, fullList) => {
    if (items.length > 0 && items.length >= fullList.length) {
      setHasMore(false);
      return;
    }
    if (items.length === 0 && fullList.length === 0) {
      return;
    }
    const itemsMetadata = await fetchItemsMetadata(items, fullList);
    setItems(itemsMetadata);
  };

  // Get metadata of an array of items
  const fetchItemsMetadata = async (items, totalItems) => {
    const newMints = totalItems.slice(items.length, items.length + 10);
    const newMetadata = newMints.map(async (item, i) => {
      const promise = await getTokenMetadata(item?.mint);
      const tokenMD = await Promise.resolve(promise);
      tokenMD["list_price"] = item?.price;
      tokenMD["list_mp"] = item?.marketplace;
      tokenMD["owner"] = item?.owner;
      return tokenMD;
    });
    const newResolved = await Promise.all(newMetadata);
    const fullItems = [...items, ...newResolved];
    return fullItems;
  };

  // Tells Infinite Scroll which full array to use
  const selectedItems = () => {
    if (seeAllItems) {
      return walletItems;
    }

    if (!seeAllItems) {
      return listedItems;
    }
  };

  return (
    <div className="col-12 d-flex flex-column align-items-center justify-content-center mt-4">
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
              nfts={walletItems.length}
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

      {wallet.connected && items.length > 0 && (
        <div className="col-12 col-xxl-10 d-flex flex-row justify-content-center">
          <InfiniteScroll
            dataLength={items.length}
            next={() => {
              fetchAndSetItems(items, selectedItems());
            }}
            hasMore={hasMore}
            loader={
              <div className="mt-5 mb-5">
                <Loader />
              </div>
            }
          >
            {!seeAllItems && items.length > 0 && (
              <div
                className="col-12 d-flex flex-row flex-wrap justify-content-center mt-4"
                style={{ width: "100%", overflow: "visible" }}
              >
                {items.length > 0 &&
                  items.map((item, i) => {
                    return (
                      <div
                        className="nft_grid_card col-12 col-sm-8 col-md-6 col-xl-4 col-xxl-3 p-2 p-lg-3"
                        key={i}
                      >
                        <NftCardListed item={item} links={""} />
                      </div>
                    );
                  })}
              </div>
            )}

            {seeAllItems && items.length > 0 && (
              <div className="col-12 d-flex flex-row flex-wrap justify-content-center mt-4">
                {items.map((item, i) => {
                  return (
                    <div
                      className="nft_grid_card col-12 col-sm-8 col-md-6 col-xl-4 col-xxl-3 p-2 p-lg-3"
                      key={i}
                    >
                      <NftCard item={item} links={""} />
                    </div>
                  );
                })}
              </div>
            )}
          </InfiniteScroll>
        </div>
      )}

      {wallet.connected && items.length === 0 && (
        <div className="mt-5">
          <Loader />
        </div>
      )}
    </div>
  );
}
