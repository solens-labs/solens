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
import Loader from "../Loader";
import { marketplaceSelect } from "../../utils/collectionStats";

export default function TradingModule(props) {
  const {
    invalid,
    invalidCollection,
    item,
    collection,
    ownerAccount,
    tokenAccount,
    listed,
    listedDetails,
    floorDetails,
  } = props;
  const user = useSelector(selectAddress);
  const history = useHistory();
  const { price, owner, marketplace, mint } = listedDetails;

  const [loading, setLoading] = useState(false);

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

  const floorDifference =
    ((price - floorDetails.floor) / floorDetails.floor) * 100;

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

        {listed && (
          <div className="col-12 d-flex flex-column align-items-center justify-content-center p-md-2 mt-2 mb-2">
            <h4 className="m-0 p-0">
              Listed on {marketplaceSelect(marketplace)}
            </h4>
            <h4 className="item_price m-0 mt-2 p-0">{price} SOL</h4>
            <h5 className="" style={{ fontSize: "1rem" }}>
              {floorDifference > 0 &&
                floorDifference.toFixed(2) + "% above floor"}
            </h5>
          </div>
        )}

        {!listed && !invalid && (
          <div className="col-12 d-flex align-items-center justify-content-center p-md-2 mt-2 mb-2">
            <h4 className="m-0 p-0 pt-3">Item Not Listed</h4>
          </div>
        )}

        {invalid && (
          <div className="col-12 d-flex align-items-center justify-content-center p-md-2 mt-2 mb-2">
            <h4 className="m-0 p-0 pt-3">Invalid Token</h4>
          </div>
        )}
      </div>

      {loading && (
        <div className="col-12 d-flex justify-content-center overflow-hidden">
          <Loader />
        </div>
      )}

      <hr
        style={{ color: "rgb(65, 37, 156)", width: "100%", height: 2 }}
        className="m-0 mb-3 p-0"
      />

      {!user && !loading && (
        <div className="trading_connect col-12 d-flex justify-content-center align-items-center">
          {connectButton()}
        </div>
      )}

      {user && user === ownerAccount && !listed && !loading && (
        <TradeListing
          invalid={invalid}
          item={item}
          ownerAccount={ownerAccount}
          tokenAccount={tokenAccount}
          setLoading={setLoading}
        />
      )}

      {user && user === owner && listed && !loading && (
        <TradeCancel
          item={item}
          price={price}
          tokenAccount={tokenAccount}
          setLoading={setLoading}
          marketplace={marketplace}
          listedDetails={listedDetails}
        />
      )}

      {/* {user && user !== owner && listed && !loading && ( */}
      <TradePurchase
        item={item}
        price={price}
        seller={owner}
        tokenAccount={tokenAccount}
        setLoading={setLoading}
        marketplace={marketplace}
      />
      {/* )} */}

      <p className="terms_text m-0 mt-3 mb-1 p-0">
        There may be a slight delay between confirmation and the item status
        updating.
        <br />
        Trading functionality is currently in beta. Use at your own risk.
      </p>
    </div>
  );
}
