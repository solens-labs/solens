import React, { useState } from "react";
import { marketplaceSelect } from "../../utils/collectionStats";
import "./style.css";
import * as anchor from "@project-serum/anchor";
import {
  magicEden,
  cancelMEden,
  getEscrowAccount,
} from "../../exchanges/magicEden";
import { magicEdenIDL, magicEdenV2IDL } from "../../exchanges/magicEdenIDL";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { buySolanart } from "../../exchanges/solanart";
import { useHistory } from "react-router";
import ReactGA from "react-ga";
import { exchangeApi } from "../../constants/constants";
import smb_logo from "../../assets/images/smb_logo.png";
import { useSelector } from "react-redux";
import {
  selectTradingEnabled,
  selectTradingME,
  selectTradingSA,
} from "../../redux/trade";
import {
  acceptOfferMEv2,
  cancelSellMEv2,
  magicEdenV2,
} from "../../exchanges/magicEdenV2";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

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
  const tradingME = useSelector(selectTradingME);
  const tradingSA = useSelector(selectTradingSA);

  const [txHashAnalytics, setTxHashAnalytics] = useState("");

  const cancelNft = async () => {
    if (!tradingEnabled) {
      alert("Trading is temporarily disabled.");
    }

    switch (marketplace) {
      case "magiceden":
        cancelNftMagicEden();
        break;
      case "magicedenV2":
        cancelNftMagicEdenV2();
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
    if (!tradingSA || !tradingEnabled) {
      const saLink = exchangeApi.solanart.itemDetails + item.mint;
      window.open(saLink, "_blank").focus();
      return;
    }

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
      }, 7000);
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
    if (!tradingME || !tradingEnabled) {
      const meLink = exchangeApi.magiceden.itemDetails + item.mint;
      window.open(meLink, "_blank").focus();
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
      }, 7000);
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
  const cancelNftMagicEdenV2 = async () => {
    if (!tradingME || !tradingEnabled) {
      const meLink = exchangeApi.magiceden.itemDetails + item.mint;
      window.open(meLink, "_blank").focus();
      return;
    }

    setLoading(true);
    try {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "processed",
        commitment: "processed",
      });

      const nftMint = new anchor.web3.PublicKey(item.mint);
      const seller = wallet.publicKey;
      const sellerATA = new anchor.web3.PublicKey(tokenAccount);

      const program = new anchor.Program(magicEdenV2IDL, magicEdenV2, provider);
      const final_tx = await cancelSellMEv2(
        seller,
        sellerATA,
        nftMint,
        price,
        program
      );
      // const sendTx = await sendTransaction(final_tx, connection, {
      //   skipPreflight: false,
      //   preflightCommitment: "processed",
      // });

      // setTxHash(sendTx); // not needed because no delay
      // setTxHashAnalytics(sendTx);
      // console.log(sendTx);

      // const confirmTx = await connection.confirmTransaction(
      //   sendTx,
      //   "processed"
      // );

      // ReactGA.event({
      //   category: "Trade",
      //   action: `Cancel on MagicEden`,
      //   label: item.mint,
      //   value: price,
      // });

      setTimeout(function () {
        setLoading(false);
        history.go(0);
      }, 7000);
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

  const acceptOfferMagicEdenV2 = async () => {
    if (!tradingME || !tradingEnabled) {
      const meLink = exchangeApi.magiceden.itemDetails + item.mint;
      window.open(meLink, "_blank").focus();
      return;
    }

    setLoading(true);
    try {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "processed",
        commitment: "processed",
      });

      const nftMint = new anchor.web3.PublicKey(item.mint);
      const maker = new anchor.web3.PublicKey(seller);
      const sellerATA = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        nftMint,
        maker,
        false
      );
      // HARDCODED
      const buyer = new anchor.web3.PublicKey(
        "HPgMKJ2oBTQ8JxkjPmKeDr2MWF6XzJg3NnfUUmFBB2S2"
      );
      const buyerATA = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        nftMint,
        buyer,
        false
      );
      const metadataAccount = new anchor.web3.PublicKey(item.metadata_acct);
      const program = new anchor.Program(magicEdenV2IDL, magicEdenV2, provider);
      const creators = item.creators_list;

      const final_tx = await acceptOfferMEv2(
        maker,
        buyer,
        tokenAccount,
        sellerATA,
        buyerATA,
        nftMint,
        metadataAccount,
        creators,
        // HARDCODED
        0.003,
        program
      );
      console.log(final_tx);

      const sendTx = await sendTransaction(final_tx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
      });
      setTxHash(sendTx);
      setTxHashAnalytics(sendTx);

      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );

      setTimeout(function () {
        setLoading(false);
        history.go(0);
      }, 4000);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-12 p-1">
        {marketplace !== "smb" && (
          <div className="col-12 d-flex justify-content-around">
            <div className="col-4">
              <button className="btn_mp" onClick={() => cancelNft()}>
                <div className="btn_mp_inner">Cancel Listing</div>
              </button>
            </div>
            {/* <div className="col-4">
              <button
                className="btn_mp"
                onClick={() => acceptOfferMagicEdenV2()}
              >
                <div className="btn_mp_inner">Accept Offer</div>
              </button>
            </div> */}
          </div>
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
                  loading="lazy"
                />
              </div>
            </button>
          </a>
        )}
      </div>
    </>
  );
}
