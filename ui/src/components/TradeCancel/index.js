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

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

export default function TradeCancel(props) {
  const { item, tokenAccount, marketplace, setLoading, price } = props;
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(rpcHost);

  const delistNft = async () => {
    switch (marketplace) {
      case "magiceden":
        delistNftMagicEden();
        break;
      case "solanart":
        delistNftSolanart();
        break;
      case "smb":
        delistNftSMB();
        break;
    }
  };

  const delistNftMagicEden = async () => {
    setLoading(true);
    try {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "recent",
      });

      const mint = new anchor.web3.PublicKey(item.mint);
      const maker = wallet.publicKey;
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);
      const cancelItem = await cancelMEden(maker, mint, price, program);
      console.log(cancelItem);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  const delistNftSolanart = async () => {
    setLoading(true);
    try {
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  const delistNftSMB = async () => {
    console.log("Delisting item from SMB Market");
  };

  return (
    <>
      <div className="col-8 col-lg-4 p-1">
        <button className="btn_mp" onClick={() => delistNft()}>
          <div className="btn_mp_inner">Cancel Listing</div>
        </button>
      </div>
    </>
  );
}
