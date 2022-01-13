import React, { useEffect, useState } from "react";
import "./style.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTokenMetadata } from "../../utils/getMetadata";
import Walletinfo from "../../components/WalletInfo";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
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
import { useHistory } from "react-router-dom";
import { shortenAddress } from "../../candy-machine";
import Loader from "../../components/Loader";

export default function User(props) {
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const history = useHistory();
  const wallet = useWallet();

  const walletBalance = useSelector(selectBalance);
  const walletAddress = useSelector(selectAddress);
  const nfts = useSelector(selectUserNFTs);
  const [loadedItems, setLoadedItems] = useState(false);

  // Check if NFTs have already been fetched previously
  useEffect(() => {
    if (nfts.length > 0) {
      setLoadedItems(true);
    }
  }, [nfts]);

  // Get token accounts, filter for NFTs, and fetch/set metadata
  useEffect(async () => {
    if (wallet.connected && wallet.publicKey && nfts.length === 0) {
      setLoadedItems(false);
      const userTokenAccts = await getTokenAccounts(wallet, connection);
      const userNftTokenAccts = getNftAccounts(userTokenAccts);
      const nftMetadataPromise = userNftTokenAccts.map(async (token, i) => {
        return await getTokenMetadata(token.mint);
      });
      const nftMetadata = await Promise.all(nftMetadataPromise);
      dispatch(setUserNFTs(nftMetadata));
      setLoadedItems(true);
    }

    if (!wallet.connected || (wallet.disconnecting && nfts.length > 0)) {
      dispatch(setUserNFTs([]));
      dispatch(setAddress(""));
      setLoadedItems(false);
    }
  }, [wallet]);

  // Wallet connect button for page
  const connectButton = () => {
    return (
      <WalletModalProvider className="wallet_modal" logo={solens_symbol}>
        <WalletMultiButton
          className="connect_button"
          style={{
            border: "1px solid black",
            color: "white",
            borderRadius: 15,
          }}
        />
      </WalletModalProvider>
    );
  };
  return (
    <div className="col-12 d-flex flex-column align-items-center mt-4">
      <div className="col-12 d-flex justify-content-center">
        {wallet.connected && (
          <div className="col-12 d-flex flex-column align-items-center">
            <h1>User Profile</h1>
            <div className="col-12 d-flex justify-content-center mt-2">
              <Walletinfo
                address={walletAddress}
                balance={walletBalance}
                nfts={nfts.length}
              />
            </div>
          </div>
        )}

        {!wallet.connected && (
          <div className="d-flex flex-column align-items-center">
            <h2 className="mt-5">Connect to view your profile</h2>
            {connectButton()}
          </div>
        )}
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
    </div>
  );
}
