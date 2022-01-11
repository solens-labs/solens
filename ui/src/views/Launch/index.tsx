import React, { useEffect } from "react";
import "./style.css";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import {
  selectAddress,
  selectBalance,
  setConnected,
  setAddress,
  setBalance,
  selectConnected,
} from "../../redux/app";
import { useDispatch, useSelector } from "react-redux";

export default function Launch() {
  const dispatch = useDispatch();
  const { connection } = useConnection();
  const wallet = useWallet();
  const address = useSelector(selectAddress);
  const balance = useSelector(selectBalance);
  const connected = useSelector(selectConnected);

  const getSolBalance = async (wallet: any) => {
    const balance = await connection.getBalance(wallet.publicKey);
    const converted = balance / LAMPORTS_PER_SOL;
    return converted;
  };

  // Get address, balance, and token accounts on wallet connect
  useEffect(() => {
    if (wallet.connected && wallet.publicKey && !wallet.disconnecting) {
      dispatch(setAddress(wallet.publicKey.toString()));
      dispatch(setConnected(true));
      const solBalance = getSolBalance(wallet).then((result) => {
        dispatch(setBalance(result));
      });
    } else {
      dispatch(setAddress(""));
      dispatch(setConnected(false));
      dispatch(setBalance(0));
    }
  }, [wallet]);

  return (
    <div className="col-12 d-flex flex-column align-items-center">
      <WalletModalProvider>
        <WalletMultiButton
          className="connect_button"
          style={{
            border: "1px solid black",
            color: "white",
            borderRadius: 15,
          }}
        />
      </WalletModalProvider>

      <div className="mt-5">
        <h3>Address: {address || "Connect Wallet"}</h3>
        <h3>Balance: {connected ? balance + " SOL" : "Connect Wallet"}</h3>
      </div>
    </div>
  );
}
