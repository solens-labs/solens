import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBalance } from "../../redux/app";
import {
  selectTradingEnabled,
  selectTradingME,
  selectTradingSA,
} from "../../redux/trade";
import * as anchor from "@project-serum/anchor";
import {
  magicEden,
  cancelMEden,
  getEscrowAccount,
  buyMEden,
} from "../../exchanges/magicEden";
import { magicEdenIDL, magicEdenV2IDL } from "../../exchanges/magicEdenIDL";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { buySolanart } from "../../exchanges/solanart";
import { useHistory } from "react-router";
import ReactGA from "react-ga";
import { exchangeApi } from "../../constants/constants";
import smb_logo from "../../assets/images/smb_logo.png";
import {
  buyMEv2,
  cancelOfferMEv2,
  magicEdenV2,
  offerMEv2,
} from "../../exchanges/magicEdenV2";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import "./style.css";

export default function TradePurchase(props) {
  const {
    price,
    item,
    seller,
    tokenAccount,
    marketplace,
    setLoading,
    setTxHash,
  } = props;
  const history = useHistory();
  const userBalance = useSelector(selectBalance);
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();
  const tradingEnabled = useSelector(selectTradingEnabled);
  const tradingME = useSelector(selectTradingME);
  const tradingSA = useSelector(selectTradingSA);

  const [txHashAnalytics, setTxHashAnalytics] = useState("");

  const [offerMade, setOfferMade] = useState(false);
  const [makingOffer, setMakingOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState(0);

  const buyNft = async () => {
    if (!tradingEnabled) {
      alert("Trading is temporarily disabled.");
    }

    if (!price) {
      alert("Error fetching item price.");
      return;
    }

    if (userBalance < price) {
      alert(
        `Insufficient Funds. The item costs ${price} SOL and your current balance is ${userBalance} SOL.`
      );
      return;
    }

    switch (marketplace) {
      case "magiceden":
        buyNftMagicEden();
        break;
      case "magicedenV2":
        buyNftMagicEdenV2();
        break;
      case "solanart":
        buyNftSolanart();
        break;
      case "smb":
        buyNftSMB();
        break;
    }
  };

  const buyNftMagicEden = async () => {
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

      const maker = new anchor.web3.PublicKey(seller);
      const buyer = wallet.publicKey;
      const metadataAccount = new anchor.web3.PublicKey(item.metadata_acct);
      const mint = new anchor.web3.PublicKey(item.mint);
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);
      const creators = item.creators_list;

      const final_tx = await buyMEden(
        maker,
        buyer,
        metadataAccount,
        mint,
        price,
        program,
        creators
      );

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

      ReactGA.event({
        category: "Trade",
        action: `Buy on MagicEden`,
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
        action: `Buy Failed on MagicEden`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const buyNftMagicEdenV2 = async () => {
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
      const buyer = wallet.publicKey;
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

      const final_tx = await buyMEv2(
        buyer,
        maker,
        sellerATA,
        buyerATA,
        nftMint,
        metadataAccount,
        creators,
        price,
        program
      );

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

      ReactGA.event({
        category: "Trade",
        action: `Buy on MagicEden`,
        label: item.mint,
        value: price,
      });

      setTimeout(function () {
        setLoading(false);
        history.go(0);
      }, 4000);
    } catch (e) {
      console.log(e);
      ReactGA.event({
        category: "Trade",
        action: `Buy Failed on MagicEden`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const buyNftSolanart = async () => {
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

      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );

      ReactGA.event({
        category: "Trade",
        action: `Buy on Solanart`,
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
        action: `Buy Failed on Solanart`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const buyNftSMB = async () => {
    alert("Buying from SMB Market will be supported soon.");
  };

  const makeOfferMagicEdenV2 = async () => {
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

      const program = new anchor.Program(magicEdenV2IDL, magicEdenV2, provider);
      const nftMint = new anchor.web3.PublicKey(item.mint);
      const buyer = wallet.publicKey;

      const final_tx = await offerMEv2(buyer, nftMint, offerAmount, program);

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
  const cancelOfferMagicEdenV2 = async () => {
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

      const program = new anchor.Program(magicEdenV2IDL, magicEdenV2, provider);
      const nftMint = new anchor.web3.PublicKey(item.mint);
      const buyer = wallet.publicKey;

      const final_tx = await cancelOfferMEv2(buyer, nftMint, 1, program);

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
            {makingOffer && (
              <input
                min="0"
                className="offer_input"
                value={offerAmount}
                onChange={(e) => {
                  setOfferAmount(e.target.value);
                }}
              />
            )}
            {!makingOffer && (
              <div className="col-4">
                <button className="btn_mp" onClick={() => buyNft()}>
                  <div className="btn_mp_inner">Buy Item</div>
                </button>
              </div>
            )}

            {offerMade && (
              <div className="col-4">
                <button
                  className="btn_mp"
                  onClick={() => cancelOfferMagicEdenV2()}
                >
                  <div className="btn_mp_inner">Cancel Offer</div>
                </button>
              </div>
            )}
            {!offerMade && !makingOffer && (
              <div className="col-4">
                <button className="btn_mp" onClick={() => setMakingOffer(true)}>
                  <div className="btn_mp_inner">Make Offer</div>
                </button>
              </div>
            )}
            {!offerMade && makingOffer && (
              <div className="col-4">
                <button
                  className="btn_mp"
                  onClick={() => makeOfferMagicEdenV2(true)}
                >
                  <div className="btn_mp_inner">Make Offer</div>
                </button>
              </div>
            )}
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
                Buy on
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
