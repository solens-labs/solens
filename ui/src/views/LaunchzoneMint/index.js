import React, { useEffect, useState } from "react";
import "./style.css";
import { Redirect, useParams } from "react-router-dom";
import { launch_collections } from "../../constants/launchzone";
import { Helmet } from "react-helmet";
import SocialLinks from "../../components/SocialLinks";
import Loader from "../../components/Loader";
import MintingStat from "../../components/StatMinting";
import { ProgressBar } from "react-bootstrap";
import { themeColors } from "../../constants/constants";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Countdown from "react-countdown";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { CANDY_MACHINE_PROGRAM_V2_ID } from "../../candy/candyConstants";
import { mintToken } from "../../candy/mintToken";
import { Transaction } from "@solana/web3.js";

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

export default function LaunchzoneMint(props) {
  const { symbol } = useParams();
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [collectionInfo, setCollectionInfo] = useState({});
  const [collectionLinks, setCollectionLinks] = useState({});
  const [noCollection, setNoCollection] = useState(false);

  const launchDate = new Date(collectionInfo?.date).addHours(0);
  const endDate = new Date(collectionInfo?.date).addHours(40);
  const [released, setReleased] = useState(false);
  const [ended, setEnded] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  const [mintProgress, setMintProgress] = useState(0);
  const itemsTotal = collectionInfo?.supply;
  const itemsMinted = mintProgress * 0.01 * itemsTotal;
  const itemsRemaining = 0;

  const mintOne = async () => {
    const provider = new anchor.Provider(connection, wallet, {
      preflightCommitment: "processed",
      commitment: "processed",
    });

    try {
      const idl = await anchor.Program.fetchIdl(
        CANDY_MACHINE_PROGRAM_V2_ID,
        provider
      );
      const payer = wallet.publicKey;
      const candyMachine = new anchor.web3.PublicKey(
        "EGppSnjZX2mDdvmCUQDdXJ6MpYKjPAYAcL5Wj9eqFcGj"
      );
      const treasury = new anchor.web3.PublicKey(
        "9x8EGBReaHypXrEKD674dA8HLmFJmhhrfFHwqA8MaJAA"
      );
      const mint = anchor.web3.Keypair.generate();
      const program = new anchor.Program(
        idl,
        CANDY_MACHINE_PROGRAM_V2_ID,
        provider
      );

      const final_tx = await mintToken(
        payer,
        candyMachine,
        treasury,
        mint.publicKey,
        program
      );

      const sendTx = await sendTransaction(final_tx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
        signers: [mint],
      });

      console.log({ sendTx });

      const confirmTx = await connection.confirmTransaction(
        sendTx,
        "processed"
      );
    } catch (e) {
      console.log(e);
    }

    // if (!released) {
    //   alert("Minting has not begun!");
    //   return;
    // }
    // if (ended) {
    //   alert(
    //     "Minting has completed! Please visit our marketplace for secondary sales."
    //   );
    //   return;
    // }
    // if (mintProgress === 100) {
    //   alert("Sold Out!");
    //   return;
    // }
  };

  // Sold out logic
  useEffect(() => {
    if (mintProgress >= 100) {
      setSoldOut(true);
    }
  }, [mintProgress]);

  // Set collection info from params -- change to API pull
  useEffect(() => {
    const [filtered] = launch_collections.filter(
      (item) => item.symbol === symbol
    );
    if (!filtered) {
      setNoCollection(true);
      return;
    }
    setCollectionInfo(filtered);
    const links = {
      website: filtered.website,
      twitter: filtered.twitter,
      discord: filtered.discord,
    };
    setCollectionLinks(links);
  }, [symbol]);

  // Get candy machine state
  useEffect(() => {}, []);

  return (
    <div className="collection_launch d-flex flex-column align-items-center col-12 mt-4 mt-lg-5">
      {collectionInfo?.name && (
        <Helmet>
          <title>{`Solens - ${collectionInfo.name} Launch`}</title>
          <meta
            name="description"
            content={`Trade and get analytics for ${collectionInfo?.name} on Solana's premier NFT Marketplex.`}
          />
        </Helmet>
      )}
      {noCollection && <Redirect to="/" />}

      <div className="collection_details d-flex flex-wrap col-12 col-lg-10 col-xxl-8 mb-3">
        <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
          {collectionInfo?.image ? (
            <img
              src={collectionInfo?.image}
              alt="collection_image"
              className="collection_image_large img-fluid"
            />
          ) : (
            <div className="collection_image_large d-flex justify-content-center overflow-hidden">
              <Loader />
            </div>
          )}
        </div>
        <div className="collection_heading col-12 col-lg-7 d-flex flex-column align-items-center justify-content-around">
          <div className="collection_header">
            {collectionInfo?.name ? (
              <h1 className="collection_name_large">{collectionInfo?.name}</h1>
            ) : (
              <Loader />
            )}

            {collectionLinks && <SocialLinks links={collectionLinks} />}
          </div>

          <div className="minting_stats d-flex flex-wrap justify-content-around col-12 mt-4 mb-4">
            <MintingStat
              stat={launchDate?.toLocaleDateString()}
              label={"Launch"}
            />
            <MintingStat
              stat={collectionInfo?.supply?.toLocaleString()}
              label={"Items"}
            />
            <MintingStat stat={collectionInfo?.price + " ◎"} label={"Price"} />
          </div>

          <p className="collection_description">
            {collectionInfo?.description}
          </p>
        </div>
      </div>

      <div className="minting_module chartbox d-flex flex-column align-items-center justify-content-between flex-wrap col-12 col-lg-10 col-xxl-8 mb-3 mb-lg-5 pb-3 pt-3">
        <div className="minting_title col-12 d-flex flex-column align-items-center justify-content-center">
          {!released && (
            <>
              <h2 className="m-0 p-0">Minting Begins</h2>
              <Countdown
                date={launchDate}
                onMount={({ completed }) => completed && setReleased(true)}
                onComplete={() => setReleased(true)}
                renderer={renderCounter}
              />
            </>
          )}

          {released && !ended && !soldOut && (
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
        </div>

        <div className="minting_progress col-12 d-flex flex-column align-items-center justify-content-center">
          <div className="col-6 mt-3 mb-3">
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
          <h4 className="mb-4">
            Items Minted: {itemsMinted?.toLocaleString()} /{" "}
            {itemsTotal?.toLocaleString()}{" "}
            <span
              style={{ color: themeColors[0] }}
            >{`(${mintProgress}%)`}</span>
          </h4>
        </div>

        <div className="minting_buttons col-12 d-flex flex-column align-items-center justify-content-center">
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

          {wallet.connected && released && !ended && (
            <button
              className="btn-button connect_button"
              onClick={() => mintOne()}
            >
              Mint
            </button>
          )}

          {wallet.connected && !released && (
            <button className="btn_outline_outer">
              <div className="btn_outline_inner">Launching Soon</div>
            </button>
          )}

          {ended && (
            <button className="btn-button connect_button">Ended</button>
          )}
        </div>
      </div>
    </div>
  );
}

const renderCounter = ({ days, hours, minutes, seconds, completed }) => {
  return (
    <span style={{ color: themeColors[0], fontSize: "1.3rem", marginTop: 0 }}>
      {days > 0 && `${days} days `}
      {hours > 0 && `${hours} hours, `} {minutes > 0 && `${minutes} minutes, `}
      {`${seconds} seconds `}
    </span>
  );
};
