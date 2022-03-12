import * as anchor from "@project-serum/anchor";
import React, { useEffect, useState } from "react";
import "./style.css";
import sa_logo from "../../assets/images/sa_logo_dark.png";
import me_logo from "../../assets/images/me_logo_white.png";
import { exchangeApi, themeColors } from "../../constants/constants";
import {
  marketplaceSelect,
  marketplaceSelectV2,
} from "../../utils/collectionStats";
import { magicEden, listMEden } from "../../exchanges/magicEden";
import { magicEdenIDL, magicEdenV2IDL } from "../../exchanges/magicEdenIDL";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { listSolanart } from "../../exchanges/solanart";
import { useHistory, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import {
  selectTradingEnabled,
  selectTradingME,
  selectTradingSA,
} from "../../redux/trade";
import { magicEdenV2, sellMEv2 } from "../../exchanges/magicEdenV2";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export default function TradeListing(props) {
  const {
    invalid,
    item,
    ownerAccount,
    tokenAccount,
    floorDetails,
    setLoading,
    setTxHash,
  } = props;
  const history = useHistory();
  const location = useLocation();
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();
  const tradingEnabled = useSelector(selectTradingEnabled);
  const tradingME = useSelector(selectTradingME);
  const tradingSA = useSelector(selectTradingSA);

  const lowerBoundry = floorDetails?.floor * 0.8;
  const [listPrice, setListPrice] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState("");
  const [txHashAnalytics, setTxHashAnalytics] = useState("");

  const listNft = async (marketplace) => {
    if (!tradingEnabled) {
      alert("Trading is temporarily disabled.");
    }

    if (listPrice <= 0) {
      return;
    }

    switch (marketplace) {
      case "magiceden":
        listNftMagicEden();
        break;
      case "magicedenV2":
        listNftMagicEdenV2();
        break;
      case "solanart":
        listNftSolanart();
        break;
      case "smb":
        listNftSMB();
        break;
    }
  };
  const listNftSolanart = async () => {
    if (!tradingSA || !tradingEnabled) {
      const saLink = exchangeApi.solanart.itemDetails + item.mint;
      window.open(saLink, "_blank").focus();
      return;
    }

    setLoading(true);
    try {
      const makerString = wallet.publicKey.toBase58();
      if (makerString !== ownerAccount) {
        alert("You are not the owner of this token.");
        return;
      }
      const makerNftAccount = new anchor.web3.PublicKey(tokenAccount);
      const nftMint = new anchor.web3.PublicKey(item.mint);
      const takerPrice = listPrice;
      const name = item.name;
      const token_add = item.mint;
      const img_url = item.image;

      const { final_tx, escrowTokenAccount } = await listSolanart(
        wallet,
        makerNftAccount,
        nftMint,
        takerPrice,
        name,
        token_add,
        img_url
      );
      const sendTx = await sendTransaction(final_tx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
        signers: [escrowTokenAccount],
      });
      setTxHash(sendTx);
      setTxHashAnalytics(sendTx);
      console.log(sendTx);

      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );

      ReactGA.event({
        category: "Trade",
        action: `List on Solanart`,
        label: item.mint,
        value: listPrice,
      });

      setTimeout(function () {
        setLoading(false);
        history.go(0);
        history.push(location.pathname);
      }, 6000);
    } catch (e) {
      console.log(e);
      ReactGA.event({
        category: "Trade",
        action: `Listing Failed on Solanart`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const listNftMagicEden = async () => {
    if (!tradingME || !tradingEnabled) {
      const meLink = exchangeApi.magiceden.itemDetails + item.mint;
      window.open(meLink, "_blank").focus();
      return;
    }

    setLoading(true);
    const provider = new anchor.Provider(connection, wallet, {
      preflightCommitment: "processed",
      commitment: "processed",
    });

    try {
      const makerString = wallet.publicKey.toBase58();
      if (makerString !== ownerAccount) {
        alert("You are not the owner of this token.");
        return;
      }

      const maker = wallet.publicKey;
      const makerNftAccount = new anchor.web3.PublicKey(tokenAccount);
      const nftMint = new anchor.web3.PublicKey(item.mint);
      const takerPrice = listPrice;
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);

      const final_tx = await listMEden(
        maker,
        makerNftAccount,
        nftMint,
        takerPrice,
        program
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

      ReactGA.event({
        category: "Trade",
        action: `List on MagicEden`,
        label: item.mint,
        value: listPrice,
      });

      setTimeout(function () {
        setLoading(false);
        history.go(0);
      }, 6000);
    } catch (e) {
      console.log(e);
      ReactGA.event({
        category: "Trade",
        action: `Listing Failed on MagicEden`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const listNftMagicEdenV2 = async () => {
    if (!tradingME || !tradingEnabled) {
      const meLink = exchangeApi.magiceden.itemDetails + item.mint;
      window.open(meLink, "_blank").focus();
      return;
    }

    setLoading(true);
    const provider = new anchor.Provider(connection, wallet, {
      preflightCommitment: "processed",
      commitment: "processed",
    });

    try {
      const makerString = wallet.publicKey.toBase58();
      if (makerString !== ownerAccount) {
        alert("You are not the owner of this token.");
        return;
      }

      const nftMint = new anchor.web3.PublicKey(item.mint);
      const seller = wallet.publicKey;
      const sellerATA = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        nftMint,
        seller,
        false
      );
      const program = new anchor.Program(magicEdenV2IDL, magicEdenV2, provider);

      const final_tx = await sellMEv2(
        seller,
        sellerATA,
        tokenAccount,
        nftMint,
        listPrice,
        program
      );

      // const sendTx = await sendTransaction(final_tx, connection, {
      //   skipPreflight: false,
      //   preflightCommitment: "processed",
      // });
      // setTxHash(sendTx);
      // setTxHashAnalytics(sendTx);
      // console.log(sendTx);

      // const confirmTx = await connection.confirmTransaction(
      //   sendTx,
      //   "processed"
      // );

      // ReactGA.event({
      //   category: "Trade",
      //   action: `List on MagicEden`,
      //   label: item.mint,
      //   value: listPrice,
      // });

      setTimeout(function () {
        setLoading(false);
        history.go(0);
      }, 10000);
    } catch (e) {
      console.log(e);
      ReactGA.event({
        category: "Trade",
        action: `Listing Failed on MagicEden`,
        label: txHashAnalytics,
      });
      setLoading(false);
    }
  };
  const listNftSMB = async () => {
    setLoading(true);
    alert(`Listing on SMB Market will be supported soon. `);
    setLoading(false);
  };

  useEffect(() => {
    if (listPrice > 0 && listPrice < floorDetails?.floor) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [listPrice]);

  return (
    <>
      <div className="col-12 d-flex flex-column align-items-center mt-1">
        <h5 className="p-0 m-0">Select Marketplace to List Item</h5>
        <div className="trading_buttons col-12 d-flex flex-row flex-wrap justify-content-center mb-2">
          {!invalid && (
            <div className="col-6 col-xl-5 p-1 p-xl-2">
              <button className="btn_mp">
                <div
                  className={
                    selectedMarketplace === "magicedenV2"
                      ? "btn_mp_inner_selected"
                      : "btn_mp_inner"
                  }
                  onClick={() => setSelectedMarketplace("magicedenV2")}
                >
                  <img
                    src={me_logo}
                    alt=""
                    style={{
                      height: 45,
                      background: "transparent",
                      margin: -8,
                    }}
                    loading="lazy"
                  />
                </div>
              </button>
            </div>
          )}
          {!invalid && (
            <div className="col-6 col-xl-5 p-1 p-xl-2">
              <button className="btn_mp">
                <div
                  className={
                    selectedMarketplace === "solanart"
                      ? "btn_mp_inner_selected"
                      : "btn_mp_inner"
                  }
                  onClick={() => setSelectedMarketplace("solanart")}
                >
                  <img
                    src={sa_logo}
                    alt=""
                    style={{
                      height: 41,
                      background: "transparent",
                      margin: -8,
                    }}
                    loading="lazy"
                  />
                </div>
              </button>
            </div>
          )}
        </div>

        {selectedMarketplace && (
          <div className="col-12 d-flex flex-column flex-wrap justify-content-center align-items-center">
            <div className="col-8 col-lg-6 col-xxl-4 p-1">
              <input
                className="listing_input"
                placeholder="List Price (SOL)"
                onChange={(e) => setListPrice(e.target.value)}
              />
            </div>

            {showWarning && (
              <span className="floor_warning">
                Warning! Your listing is below the current floor:{" "}
                {floorDetails?.floor} SOL
              </span>
            )}

            <div className="col-8 col-lg-4 p-1">
              <button
                className="btn_mp"
                onClick={() => listNft(selectedMarketplace)}
              >
                <div className="btn_mp_inner_selected">List Item</div>
              </button>
            </div>

            {selectedMarketplace === "magicedenV2" && (
              // Terms & Conditions for Magic Eden
              <p className="terms_text m-0 mt-2 p-0">
                By clicking "List Item", you agree to{" "}
                {marketplaceSelectV2(selectedMarketplace)}'s{" "}
                <a
                  href="https://magiceden.io/terms-of-service.pdf"
                  target="_blank"
                  style={{ textDecoration: "none", color: themeColors[0] }}
                  className="terms_text"
                >
                  Terms & Conditions
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
