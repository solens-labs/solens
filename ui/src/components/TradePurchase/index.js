import React from "react";
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
import { useWallet } from "@solana/wallet-adapter-react";

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

export default function TradePurchase(props) {
  const {
    price,
    item,
    ownerAccount,
    tokenAccount,
    marketplace,
    setLoading,
    listedDetails,
  } = props;
  const userBalance = useSelector(selectBalance);
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(rpcHost);

  const buyNft = async () => {
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

  const buyNftMagicEden = async () => {
    if (!price) {
      alert("Error fetching item price.");
    }

    if (userBalance < price) {
      alert(
        `Insufficient Funds. The item costs ${price} SOL and your current balance is ${userBalance} SOL.`
      );
      return;
    }

    setLoading(true);
    try {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "recent",
      });

      const mint = new anchor.web3.PublicKey(item.mint);
      const owner = new anchor.web3.PublicKey(listedDetails.owner);
      const [escrowFetch, bump] = await getEscrowAccount(mint, price, owner);

      const buyerString = wallet.publicKey.toBase58();
      const buyer = new anchor.web3.PublicKey(buyerString);

      const seller = new anchor.web3.PublicKey("");
      const makerNftAccount = new anchor.web3.PublicKey(tokenAccount);
      const escrowAccount = new anchor.web3.PublicKey(escrowFetch);
      const metadataAccount = new anchor.web3.PublicKey(item.metadata_acct);
      const nftMint = new anchor.web3.PublicKey(item.mint);
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);
      const creators = item.creators.map((c) => {
        return {
          pubkey: new anchor.web3.PublicKey(c.address),
          isWritable: true,
          isSigner: false,
        };
      });

      const buyItem = await buyMEden(
        buyer,
        seller,
        makerNftAccount,
        escrowAccount,
        metadataAccount,
        nftMint,
        price,
        program,
        creators
      );
      console.log(buyItem);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const buyNftSolanart = async () => {
    console.log("Buying from Solanart");
  };

  const buyNftSMB = async () => {
    console.log("Buying from SMB");
  };

  return (
    <>
      <div className="col-8 col-lg-4 p-1">
        <button className="btn_mp" onClick={() => buyNft()}>
          <div className="btn_mp_inner">Buy Item</div>
        </button>
      </div>
    </>
  );
}
