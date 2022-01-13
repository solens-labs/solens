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
import { buySolanart } from "../../exchanges/solanart";

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

export default function TradePurchase(props) {
  const { price, item, ownerAccount, tokenAccount, marketplace, setLoading } =
    props;
  const userBalance = useSelector(selectBalance);
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const connection = new anchor.web3.Connection(rpcHost);

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
  const buyNftMagicEden = async () => {
    setLoading(true);
    try {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "recent",
      });

      const seller = new anchor.web3.PublicKey(ownerAccount);
      const buyer = wallet.publicKey;
      const metadataAccount = new anchor.web3.PublicKey(item.metadata_acct);
      const mint = new anchor.web3.PublicKey(item.mint);
      const program = new anchor.Program(magicEdenIDL, magicEden, provider);
      const creators = item.creators_list;

      const buyItem = await buyMEden(
        seller,
        buyer,
        metadataAccount,
        mint,
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
    setLoading(true);
    try {
      const takerString = wallet.publicKey.toBase58();
      const makerString = "";

      const taker = new anchor.web3.PublicKey(takerString);
      const maker = new anchor.web3.PublicKey(makerString);
      const makerNftAccount = new anchor.web3.PublicKey(tokenAccount);
      const nftMint = new anchor.web3.PublicKey(item.mint);
      const takerPrice = 0;
      const creators = item.creators_list;

      const { final_tx, escrowTokenAccount } = await buySolanart(
        taker,
        maker,
        makerNftAccount,
        nftMint,
        takerPrice,
        creators
      );

      const sendTx = await sendTransaction(final_tx, connection, {
        skipPreflight: false,
        signers: [escrowTokenAccount],
      });
      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );

      console.log(sendTx);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
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
