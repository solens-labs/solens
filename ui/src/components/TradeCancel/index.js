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
import { useWallet } from "@solana/wallet-adapter-react";
import { buySolanart } from "../../exchanges/solanart";
import { useHistory } from "react-router";

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

export default function TradeCancel(props) {
  const { price, item, seller, tokenAccount, marketplace, setLoading } = props;
  const history = useHistory();
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const connection = new anchor.web3.Connection(rpcHost);

  const cancelNft = async () => {
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
      console.log(sendTx);
      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );
      setLoading(false);
      history.go(0);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const cancelNftMagicEden = async () => {
    setLoading(true);
    try {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "processed",
      });

      const mint = new anchor.web3.PublicKey(item.mint);
      const maker = wallet.publicKey;
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);
      const cancelItem = await cancelMEden(maker, mint, price, program);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  const cancelNftSMB = async () => {
    console.log("canceling item from SMB Market");
  };

  return (
    <>
      <div className="col-8 col-lg-4 p-1">
        <button className="btn_mp" onClick={() => cancelNft()}>
          <div className="btn_mp_inner">Cancel Listing</div>
        </button>
      </div>
    </>
  );
}
