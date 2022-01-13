import * as anchor from "@project-serum/anchor";
import React, { useState } from "react";
import "./style.css";
import sa_logo from "../../assets/images/sa_logo_dark.png";
import me_logo from "../../assets/images/me_logo_white.png";
import { themeColors } from "../../constants/constants";
import { marketplaceSelect } from "../../utils/collectionStats";
import { magicEden, listMEden } from "../../exchanges/magicEden";
import magicEdenIDL from "../../exchanges/magicEdenIDL";
import { useWallet } from "@solana/wallet-adapter-react";
import { listSolanart } from "../../exchanges/solanart";

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

export default function TradeListing(props) {
  const { invalid, item, ownerAccount, tokenAccount, setLoading } = props;
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const connection = new anchor.web3.Connection(rpcHost);

  const [listPrice, setListPrice] = useState(0);
  const [selectedMarketplace, setSelectedMarketplace] = useState("");

  const listNft = async (marketplace) => {
    switch (marketplace) {
      case "magiceden":
        listNftMagicEden();
        break;
      case "solanart":
        listNftSolanart();
        break;
      case "smb":
        listNftSMB();
        break;
    }
  };

  const listNftMagicEden = async () => {
    setLoading(true);
    if (listPrice > 0) {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: "recent",
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

        const listItem = await listMEden(
          maker,
          makerNftAccount,
          nftMint,
          takerPrice,
          program
        );
        console.log(listItem);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("List must be above 0.");
    }
    setLoading(false);
  };
  const listNftSolanart = async () => {
    setLoading(true);
    if (listPrice > 0) {
      try {
        const makerString = wallet.publicKey.toBase58();
        if (makerString !== ownerAccount) {
          alert("You are not the owner of this token.");
          return;
        }

        const makerNftAccount = new anchor.web3.PublicKey(tokenAccount);
        const nftMint = new anchor.web3.PublicKey(item.mint);
        const takerPrice = listPrice;

        const { final_tx, escrowTokenAccount } = await listSolanart(
          wallet,
          makerNftAccount,
          nftMint,
          takerPrice
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
    } else {
      alert("List must be above 0.");
    }
    setLoading(false);
  };
  const listNftSMB = async () => {
    setLoading(true);
    console.log(`listing on SMB for ${listPrice}.`);
    setLoading(false);
  };

  return (
    <div className="col-12 d-flex flex-column align-items-center mt-1">
      <hr
        style={{
          color: "white",
          width: "50%",
          margin: 0,
          marginBottom: "1rem",
          padding: 0,
        }}
        className=""
      />

      <h5 className="p-0 m-0">Select Marketplace to List Item</h5>
      <div className="trading_buttons col-12 d-flex flex-row flex-wrap justify-content-center mb-2">
        {!invalid && (
          <div className="col col-md-4 p-1 p-md-2">
            <button className="btn_mp">
              <div
                className={
                  selectedMarketplace === "magiceden"
                    ? "btn_mp_inner_selected"
                    : "btn_mp_inner"
                }
                onClick={() => setSelectedMarketplace("magiceden")}
              >
                <img
                  src={me_logo}
                  alt=""
                  style={{
                    height: 45,
                    background: "transparent",
                    margin: -8,
                  }}
                />
              </div>
            </button>
          </div>
        )}
        {!invalid && (
          <div className="col col-md-4 p-1 p-md-2">
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
                />
              </div>
            </button>
          </div>
        )}
      </div>

      {selectedMarketplace && (
        <div className="col-12 d-flex flex-column flex-wrap justify-content-center align-items-center">
          <div className="col-8 col-lg-4 p-1">
            <input
              className="listing_input"
              placeholder="List Price (SOL)"
              onChange={(e) => setListPrice(e.target.value)}
            />
          </div>

          <div className="col-8 col-lg-4 p-1">
            <button
              className="btn_mp"
              onClick={() => listNft(selectedMarketplace)}
            >
              <div className="btn_mp_inner_selected">List Item</div>
            </button>
          </div>

          {selectedMarketplace === "magiceden" && (
            // Terms & Conditions for Magic Eden
            <p className="terms_text m-0 mt-2 p-0">
              By clicking "List Item", you agree to{" "}
              {marketplaceSelect(selectedMarketplace)}'s{" "}
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
  );
}
