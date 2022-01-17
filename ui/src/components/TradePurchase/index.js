import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectBalance } from "../../redux/app";
import * as anchor from "@project-serum/anchor";
import {
  magicEden,
  cancelMEden,
  getEscrowAccount,
  buyMEden,
} from "../../exchanges/magicEden";
import magicEdenIDL from "../../exchanges/magicEdenIDL";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { buySolanart } from "../../exchanges/solanart";
import { useHistory } from "react-router";
import ReactGA from "react-ga";
import { exchangeApi } from "../../constants/constants";
import smb_logo from "../../assets/images/smb_logo.png";

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

  const [txHashAnalytics, setTxHashAnalytics] = useState("");

  const buyNft = async () => {
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
      case "solanart":
        buyNftSolanart();
        break;
      case "smb":
        buyNftSMB();
        break;
    }
  };
  const buyNftSolanart = async () => {
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
  const buyNftMagicEden = async () => {
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
  const buyNftSMB = async () => {
    alert("Buying from SMB Market will be supported soon.");
  };

  return (
    <>
      <div className="col-8 col-lg-4 p-1">
        {marketplace !== "smb" && (
          <button className="btn_mp" onClick={() => buyNft()}>
            <div className="btn_mp_inner">Buy Item</div>
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
                Buy on
                <img
                  src={smb_logo}
                  style={{
                    width: 45,
                    paddingBottom: 1,
                    height: "auto",
                    marginLeft: 10,
                  }}
                />
              </div>
            </button>
          </a>
        )}
      </div>
    </>
  );
}
