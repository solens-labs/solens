import React, { useState } from "react";
import { marketplaceSelect } from "../../utils/collectionStats";
import "./style.css";
import * as anchor from "@project-serum/anchor";
import {
  magicEden,
  cancelMEden,
  getEscrowAccount,
} from "../../exchanges/magicEden";
import magicEdenIDL from "../../exchanges/magicEdenIDL";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { buySolanart } from "../../exchanges/solanart";
import { useHistory } from "react-router";
import ReactGA from "react-ga";
import { exchangeApi } from "../../constants/constants";
import smb_logo from "../../assets/images/smb_logo.png";
import { useSelector } from "react-redux";
import { selectTradingEnabled } from "../../redux/app";

export default function TradeCancel(props) {
  const {
    price,
    item,
    seller,
    tokenAccount,
    marketplace,
    setLoading,
    setTxHash,
    setListed,
  } = props;
  const history = useHistory();
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();
  const tradingEnabled = useSelector(selectTradingEnabled);

  const [txHashAnalytics, setTxHashAnalytics] = useState("");

  const cancelNft = async () => {
    // if (!tradingEnabled) {
    //   alert("Trading is temporarily disabled.");
    //   return;
    // }

    switch (marketplace) {
      case "magiceden":
        cancelNftMagicEden();
        break;
      case "solanart":
        cancelNftSolanart();
        break;
      case "smb":
        cancelNftSMB();
        break;
    }
  };
  const cancelNftSolanart = async () => {
    setLoading(true);
    try {
      const taker = wallet.publicKey;
      const maker = new anchor.web3.PublicKey(seller);
      const nftMint = new anchor.web3.PublicKey(item.mint);
      const creators = item.creators_list;

      const final_tx = await buySolanart(
        taker,
        maker,
        nftMint,
        price,
        creators
      );

      const sendTx = await sendTransaction(final_tx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
      });
      setTxHash(sendTx);
      setTxHashAnalytics(sendTx);
      console.log(sendTx);

      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );
      // setListed(false);

      ReactGA.event({
        category: "Trade",
        action: `Cancel on Solanart`,
        label: item.mint,
        value: price,
      });

      setTimeout(function () {
        history.go(0);
        setLoading(false);
      }, 3000);
    } catch (e) {
      console.log(e);
      ReactGA.event({
        category: "Trade",
        action: `Cancel Failed on Solanart`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const cancelNftMagicEden = async () => {
    if (!tradingEnabled) {
      alert("Trading on Magic Eden is temporarily disabled.");
      return;
    }

    setLoading(true);
    try {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "processed",
        commitment: "processed",
      });

      const mint = new anchor.web3.PublicKey(item.mint);
      const maker = wallet.publicKey;
      const token = new anchor.web3.PublicKey(tokenAccount);
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);
      const final_tx = await cancelMEden(maker, mint, token, price, program);
      const sendTx = await sendTransaction(final_tx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
      });

      setTxHash(sendTx); // not needed because no delay
      setTxHashAnalytics(sendTx);
      console.log(sendTx);

      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );

      ReactGA.event({
        category: "Trade",
        action: `Cancel on MagicEden`,
        label: item.mint,
        value: price,
      });

      setTimeout(function () {
        setLoading(false);
        history.go(0);
      }, 3000);
    } catch (e) {
      console.log(e);
      ReactGA.event({
        category: "Trade",
        action: `Cancel Failed on MagicEden`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const cancelNftSMB = async () => {
    setLoading(true);
    alert("Canceling item on SMB Market will be supported soon.");
    setLoading(false);
  };

  return (
    <>
      <div className="col-8 col-lg-4 p-1">
        {marketplace !== "smb" && (
          <button className="btn_mp" onClick={() => cancelNft()}>
            <div className="btn_mp_inner">Cancel Listing</div>
          </button>
        )}

        {marketplace === "smb" && (
          <a
            href={exchangeApi.smb.itemDetails + item.mint}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <button className="btn_mp">
              <div className="btn_mp_inner d-flex flex-row">
                Cancel on
                <img
                  src={smb_logo}
                  style={{
                    width: 45,
                    paddingBottom: 1,
                    height: "auto",
                    marginLeft: 10,
                  }}
                  loading="eager"
                />
              </div>
            </button>
          </a>
        )}
      </div>
    </>
  );
}
