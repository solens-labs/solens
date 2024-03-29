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
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TradeCancel from "../TradeCancel";
import Loader from "../Loader";
import { marketplaceSelectV2 } from "../../utils/collectionStats";
import sa_logo from "../../assets/images/ss_logo.png";

export default function TradingModule(props) {
  const {
    address,
    invalid,
    invalidCollection,
    item,
    collection,
    ownerAccount,
    tokenAccount,
    listed,
    listedDetails,
    floorDetails,
    setListed,
  } = props;
  const user = useSelector(selectAddress);
  const history = useHistory();
  const { price, owner, marketplace, mint } = listedDetails;

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const collectionInsights = () => {
    history.push(`/collection/${collection.symbol}`); // COLLECTION LANDING LINK
    return;
  };

  const floorDifference =
    ((price - floorDetails?.floor) / floorDetails?.floor) * 100;

  return (
    <div className="trading_module col-12 d-flex flex-column align-items-center justify-content-around p-2 pb-3">
      <div className="item_title_and_details col-12 d-flex flex-column align-items-center">
        <h1 className="item_title m-0 p-0">
          {invalid ? "Invalid Token" : item?.name}
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
          <div className="col-12 d-flex flex-column align-items-center justify-content-center p-md-2 mt-3 mb-2">
            <h4 className="m-0 p-0">
              Listed on {marketplaceSelectV2(marketplace)}
            </h4>
            <h4 className="item_price m-0 mt-2 p-0">{price} SOL</h4>
            {/* <h5 className="" style={{ fontSize: "1rem" }}>
              {floorDifference > 0 &&
                floorDifference.toFixed(2) + "% above floor"}
            </h5> */}
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

      <hr
        style={{ color: "rgb(65, 37, 156)", width: "100%", height: 2 }}
        className="m-0 mb-3 mt-2 p-0"
      />
      {loading && (
        <div className="col-8 d-flex justify-content-center">
          <Loader />
        </div>
      )}

      {!user && !loading && (
        <div className="trading_connect col-12 d-flex justify-content-center align-items-center">
          <WalletMultiButton
            className="connect_button"
            style={{
              border: "1px solid black",
              color: "white",
              borderRadius: 15,
            }}
          />
        </div>
      )}

      {user && user === ownerAccount && !listed && !loading && (
        <TradeListing
          invalid={invalid}
          item={item}
          ownerAccount={ownerAccount}
          tokenAccount={tokenAccount}
          setLoading={setLoading}
          setTxHash={setTxHash}
          floorDetails={floorDetails}
        />
      )}

      {user && user === owner && listed && !loading && (
        <TradeCancel
          item={item}
          price={price}
          seller={owner}
          tokenAccount={tokenAccount}
          setLoading={setLoading}
          marketplace={marketplace}
          listedDetails={listedDetails}
          setTxHash={setTxHash}
          setListed={setListed}
        />
      )}

      {user && user !== owner && listed && !loading && (
        <TradePurchase
          item={item}
          price={price}
          seller={owner}
          tokenAccount={tokenAccount}
          setLoading={setLoading}
          marketplace={marketplace}
          setTxHash={setTxHash}
        />
      )}

      {user && user !== ownerAccount && !listed && !loading && (
        <div className="col-4 d-flex justify-content center">
          <a
            href={explorerLink("token", address)}
            target="_blank"
            style={{ width: "100%", textDecoration: "none" }}
          >
            <button className="btn_mp" style={{ height: 55 }}>
              <div className="btn_mp_inner">
                <img
                  src={sa_logo}
                  alt=""
                  style={{
                    height: 41,
                    background: "transparent",
                  }}
                  loading="lazy"
                />
              </div>
            </button>
          </a>
        </div>
      )}

      {txHash && (
        <div className="col-12 d-flex justify-content-center mt-3">
          <a
            href={explorerLink("tx", txHash)}
            style={{ textDecoration: "none" }}
            target="_blank"
          >
            <button className="btn_mp">
              <div className="btn_mp_inner p-4 pt-0 pb-0">View Explorer</div>
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
