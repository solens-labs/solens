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

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

export default function TradeListing(props) {
  const { invalid, item, ownerAccount, tokenAccount, loading, setLoading } =
    props;
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(rpcHost);

  const [listPrice, setListPrice] = useState(0);
  const [selectedMarketplace, setSelectedMarketplace] = useState("");

  const listNft = async () => {
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

        const maker = new anchor.web3.PublicKey(makerString);
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

  return (
    <div className="col-12 mt-1">
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
                    height: 45,
                    background: "transparent",
                    margin: -8,
                  }}
                />
              </div>
            </button>
          </div>
        )}
      </div>

      {!loading && selectedMarketplace && (
        <div className="col-12 d-flex flex-column flex-wrap justify-content-center align-items-center">
          <div className="col-8 col-lg-4 p-1">
            <input
              className="listing_input"
              placeholder="List Price (SOL)"
              onChange={(e) => setListPrice(e.target.value)}
            />
          </div>

          <div className="col-8 col-lg-4 p-1">
            <button className="btn_mp" onClick={listNft}>
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
