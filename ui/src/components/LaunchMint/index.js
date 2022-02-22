import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import { Link, Redirect, useParams } from "react-router-dom";
import { themeColors } from "../../constants/constants";
import {
  launch_collections,
  minting_collections,
} from "../../constants/launchzone";
import "./style.css";
import Loader from "../Loader";
import SocialLinks from "../SocialLinks";
import Countdown from "react-countdown";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { Solens_Candy_Machine, CandyIDL } from "../../candy/candyConstants";
import { mintToken } from "../../candy/mintToken";
import { getCandyMachineState } from "../../candy/getCandyMachineState";
import { selectBalance } from "../../redux/app";
import { useSelector } from "react-redux";
import { alertInsufficientBalance, alertSoldOut } from "../../constants/alerts";

export default function LaunchMint(props) {
  const { symbol } = props;
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();
  const balance = useSelector(selectBalance);

  const [collectionInfo, setCollectionInfo] = useState({});
  const [collectionLinks, setCollectionLinks] = useState({});
  const [noCollection, setNoCollection] = useState(false);

  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const launchDate = new Date(collectionInfo?.launchDate).addHours(0);
  const endDate =
    collectionInfo?.endDate && new Date(collectionInfo?.endDate).addHours(0);
  const now = new Date();

  const [mintProgress, setMintProgress] = useState(0);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [itemsMinted, setItemsMinted] = useState(0);

  const [released, setReleased] = useState(false); // toggle to display mint/launchingSoon button
  const [ended, setEnded] = useState(false); // set in LZ constants, prevents minting
  const [soldOut, setSoldOut] = useState(false);

  // Set collection info from params -- change to API pull
  useEffect(() => {
    const [homepage] = launch_collections.filter(
      (item) => item.symbol === symbol
    );
    const [minting] = minting_collections.filter(
      (item) => item.symbol === symbol
    );
    // console.log({ homepage, minting });
    const collection = homepage || minting;
    // console.log({ collection });
    if (!collection) {
      setNoCollection(true);
      return;
    }
    setItemsTotal(collection.supply);
    setItemsMinted(collection.preminted);
    setMintProgress((collection.preminted / collection.supply) * 100);
    setCollectionInfo(collection);

    const links = {
      website: collection.website,
      twitter: collection.twitter,
      discord: collection.discord,
    };
    setCollectionLinks(links);
  }, [symbol]);

  // Get candy machine state and populate page
  useEffect(() => {
    if (symbol && collectionInfo.candyMachineID) {
      getSetCandyState();
    }
  }, [symbol, collectionInfo]);

  // Mint one item
  const mintOne = async (candyMachineID) => {
    if (balance < collectionInfo?.price) {
      return alertInsufficientBalance();
    }

    setLoading(true);
    const provider = new anchor.Provider(connection, wallet, {
      preflightCommitment: "processed",
      commitment: "processed",
    });
    try {
      const payer = wallet.publicKey;
      const candyMachine = new anchor.web3.PublicKey(candyMachineID);
      const mint = anchor.web3.Keypair.generate();
      const program = new anchor.Program(
        CandyIDL,
        Solens_Candy_Machine,
        provider
      );

      const candyMachineState = await program.account.candyMachine.fetch(
        candyMachine
      );
      const itemsTotal = candyMachineState.data.itemsAvailable.toNumber();
      const itemsMinted = candyMachineState.itemsRedeemed.toNumber();
      const itemsRemaining = itemsTotal - itemsMinted;
      if (itemsRemaining === 0) {
        return alertSoldOut();
      }

      const final_tx = await mintToken(
        payer,
        candyMachine,
        candyMachineState.wallet,
        candyMachineState.raise,
        mint.publicKey,
        program
      );
      const sendTx = await sendTransaction(final_tx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
        signers: [mint],
      });
      console.log({ sendTx });
      setTxHash(sendTx);
      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "confirmed"
      );
      await getSetCandyState();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const getSetCandyState = async () => {
    const { itemsRemaining, itemsMintedAndPreminted, progress, launchDate } =
      await getCandyMachineState(connection, wallet, collectionInfo);

    // console.log({
    //   itemsRemaining,
    //   itemsMintedAndPreminted,
    //   progress,
    //   launchDate,
    // });
    setItemsMinted(itemsMintedAndPreminted);
    setMintProgress(progress);
    if (itemsRemaining === 0) {
      setSoldOut(true);
    }
  };

  return (
    <div className="col-12 d-flex flex-column align-items-center">
      <div className="col-12 col-lg-10 col-xxl-8 p-3 pt-0 pb-0 d-flex justify-content-start">
        <h1 className="subheading">Featured Launch</h1>
      </div>
      <div className="chartbox collection_details d-flex flex-wrap justify-content-center col-12 col-lg-10 col-xxl-8 mt-3 mb-3">
        <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
          {collectionInfo?.image ? (
            <img
              src={collectionInfo?.image}
              alt="collection_image"
              className="collection_image_large img-fluid"
              loading="eager"
            />
          ) : (
            <div className="collection_image_large d-flex justify-content-center overflow-hidden">
              <Loader />
            </div>
          )}
        </div>

        <div className="minting_module  d-flex flex-column align-items-center justify-content-center flex-wrap col-12 col-lg-7 mt-3 mt-lg-0 mb-3 mb-lg-5">
          {/* <h2>Minting Progress</h2> */}

          <div>
            {collectionInfo?.name ? (
              <h1 className="collection_name_large">{collectionInfo?.name}</h1>
            ) : (
              <Loader />
            )}

            {collectionLinks && <SocialLinks links={collectionLinks} />}
          </div>

          {/* <div className="minting_title col-12 d-flex flex-column align-items-center">
            {!released && (
              <>
                <h2 className="m-0 p-0">Minting Begins</h2>
                <Countdown
                  date={launchDate && launchDate}
                  onMount={({ completed }) => completed && setReleased(true)}
                  onComplete={() => setReleased(true)}
                  renderer={renderCounter}
                />
              </>
            )}

            {released && !ended && !soldOut && !endDate && (
              <>
                <h2 className="m-0 p-0">Minting In Progress</h2>
              </>
            )}

            {released && !ended && !soldOut && endDate && (
              <>
                <h2 className="m-0 p-0">Time Remaining</h2>
                <Countdown
                  date={endDate}
                  onMount={({ completed }) => completed && setEnded(true)}
                  onComplete={() => setEnded(true)}
                  renderer={renderCounter}
                />
              </>
            )}

            {released && soldOut && (
              <>
                <h2 className="m-0 p-0">Sold Out</h2>
                <span
                  style={{
                    color: themeColors[0],
                    fontSize: "1.3rem",
                    marginTop: 0,
                  }}
                >
                  Available to trade on Solens shortly
                </span>
              </>
            )}

            {released && ended && (
              <>
                <h2 className="m-0 p-0">Minting Complete</h2>
                <span
                  style={{
                    color: themeColors[0],
                    fontSize: "1.3rem",
                    marginTop: 0,
                  }}
                >
                  Available to trade on Solens shortly
                </span>
              </>
            )}
          </div> */}

          <div className="minting_progress col-12 d-flex flex-column align-items-center">
            <div className="col-10 col-lg-6 mt-3 mb-3">
              <ProgressBar
                style={{
                  backgroundColor: "rgb(25, 16, 51)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  // height: 30,
                }}
                animated
                striped={true}
                now={mintProgress}
                // label={`${mintProgress}%`}
              />
            </div>

            <h4 className="col-10 col-xl-6 mb-4">
              Items Minted: {itemsMinted?.toFixed(0).toLocaleString() || 0} /{" "}
              {itemsTotal?.toLocaleString()}{" "}
              <span style={{ color: themeColors[0] }}>
                {`(${Math.floor(mintProgress)}%)`}
              </span>
            </h4>
          </div>

          <div className="minting_buttons col-12 d-flex flex-column align-items-center">
            {!wallet.connected && !ended && (
              <WalletMultiButton
                className="connect_button"
                style={{
                  border: "1px solid black",
                  color: "white",
                  borderRadius: 15,
                }}
              />
            )}

            {wallet.connected && !released && (
              <>
                <button className="btn_outline_outer">
                  <div className="btn_outline_inner">
                    <Countdown
                      date={launchDate && launchDate}
                      onMount={({ completed }) =>
                        completed && setReleased(true)
                      }
                      onComplete={() => setReleased(true)}
                      renderer={renderCounter}
                    />
                  </div>
                </button>
              </>
            )}

            {wallet.connected && released && !soldOut && !ended && !loading && (
              <button
                className="btn-button connect_button"
                onClick={() => mintOne(collectionInfo?.candyMachineID)}
              >
                Mint
              </button>
            )}

            {loading && (
              <div className="col-4 mb-3">
                <Loader />
              </div>
            )}

            {txHash && (
              <div className="d-flex flex-row col-9 col-md-7 col-lg-5 col-xl-4 col-xxl-3 justify-content-around">
                <a
                  href={`https://solscan.io/tx/${txHash}`}
                  target="_blank"
                  aria-label="solscan link"
                  style={{
                    marginTop: 15,
                    color: themeColors[0],
                    fontSize: "1rem",
                    textDecoration: "none",
                  }}
                >
                  View Explorer
                </a>
                <Link
                  to="/user"
                  style={{
                    marginTop: 15,
                    color: themeColors[0],
                    fontSize: "1rem",
                    textDecoration: "none",
                  }}
                >
                  View Wallet
                </Link>
              </div>
            )}

            {(soldOut || ended) && released && (
              <button className="btn-button connect_button">Ended</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const renderCounter = ({ days, hours, minutes, seconds, completed }) => {
  return (
    <span style={{ color: themeColors[0], fontSize: "1.3rem", marginTop: 0 }}>
      {days > 0 && `${days}d `}
      {days > 0 && hours === 0 && `${hours}h `}

      {hours > 0 && `${hours}h `}
      {(days > 0 || hours > 0) && minutes === 0 && `${minutes}m `}

      {minutes > 0 && `${minutes}m `}

      {seconds >= 0 && `${seconds}s `}
    </span>
  );
};
