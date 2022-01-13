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
  const {
    item,
    ownerAccount,
    tokenAccount,
    marketplace,
    setLoading,
    listedDetails,
    price,
  } = props;
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
      const owner = new anchor.web3.PublicKey(listedDetails.owner);
      const [escrowFetch, bump] = await getEscrowAccount(mint, price, owner);

      const makerString = wallet.publicKey.toBase58();
      const maker = new anchor.web3.PublicKey(makerString);
      const makerNftAccount = new anchor.web3.PublicKey(tokenAccount);
      const escrowAccount = new anchor.web3.PublicKey(escrowFetch);
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);

      // console.log(
      //   { mint: mint.toBase58() },
      //   { owner: owner.toBase58() },
      //   { escrowFetch: escrowFetch },
      //   { maker: maker.toBase58() },
      //   { makerNftAccount: makerNftAccount.toBase58() },
      //   { escrowAccount: escrowAccount.toBase58() },
      //   { program: program }
      // );

      const cancelItem = await cancelMEden(
        maker,
        makerNftAccount,
        escrowAccount,
        program
      );
      console.log(cancelItem);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const delistNftSolanart = async () => {
    console.log("Delisting item from Solanart");
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
