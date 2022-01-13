import { useEffect, useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import solens_symbol from "../../assets/images/logo3.png";
import sol_logo from "../../assets/images/sol_logo.png";
import { exchangeApi, explorerLink } from "../../constants/constants";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAddress } from "../../redux/app";
import TradeListing from "../TradeListing";
import TradePurchase from "../TradePurchase";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import TradeCancel from "../TradeCancel";

export default function TradingModule(props) {
  const { invalid, invalidCollection, item, collection, ownerAccount } = props;
  const user = useSelector(selectAddress);
  const history = useHistory();

  const [temp_listed, setTempListed] = useState(false);
  const [temp_price, setTempPrice] = useState(0);
  const [selectedMarketplace, setSelectedMarketplace] = useState("");

  useEffect(() => {
    const probability = Math.random() * 100;
    if (probability >= 50) {
      setTempListed(true);
      setTempPrice(Math.floor(probability));
    } else {
      setTempListed(false);
      setTempPrice(0);
    }
  }, []);

  const collectionInsights = () => {
    history.push(`/collection/${collection.symbol}`);
    return;
  };

  // Wallet connect button for page
  const connectButton = () => {
    return (
      <WalletModalProvider className="wallet_modal" logo={solens_symbol}>
        <WalletMultiButton
          className="connect_button_large"
          style={{
            border: "1px solid black",
            color: "white",
            borderRadius: 15,
          }}
        />
      </WalletModalProvider>
    );
  };

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-center justify-content-around p-2 pb-3">
      <div className="item_title_and_details col-12 d-flex flex-column align-items-center">
        <h1 className="item_title m-0 p-0">
          {invalid ? "Invalid Token" : item.name}
        </h1>

        <h4 className="item_collection m-0 p-0" onClick={collectionInsights}>
          {collection?.name}
          {invalid && "Please check the Mint Address"}
          {!invalid && invalidCollection && "Unsupported Collection"}
        </h4>

        <hr
          style={{ color: "rgb(65, 37, 156)", width: "100%", height: 2 }}
          className="m-0 mt-2 p-0"
        />

        {temp_listed && (
          <div className="col-12 d-flex flex-column align-items-center justify-content-center p-md-2 mt-2 mb-3">
            <h4 className="item_price m-0 p-0">
              {item.price || temp_price} SOL
            </h4>
            <h4 className="m-0 p-0">Listed on Magic Eden</h4>
          </div>
        )}

        {!temp_listed && (
          <div className="col-12 d-flex align-items-center justify-content-center p-md-2 mt-2 mb-3">
            <h4 className="m-0 p-0 pt-3">Item Not Listed</h4>
          </div>
        )}
      </div>

      {!user && (
        <div className="trading_connect col-12 d-flex justify-content-center align-items-center">
          {connectButton()}
        </div>
      )}

      {user && user === ownerAccount && !temp_listed && (
        <TradeListing
          selectedMarketplace={selectedMarketplace}
          setSelectedMarketplace={setSelectedMarketplace}
          invalid={invalid}
        />
      )}

      {user && user === ownerAccount && temp_listed && (
        <TradeCancel marketplace={"magiceden"} />
      )}

      {user && user !== ownerAccount && temp_listed && (
        <TradePurchase price={temp_price} />
      )}
    </div>
  );
}
