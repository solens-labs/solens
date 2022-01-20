import React, { useEffect, useState } from "react";
import "./style.css";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "../../candy-machine";

import {
  selectAddress,
  selectBalance,
  setConnected,
  setAddress,
  setBalance,
  setLoading,
  selectLoading,
  setCurrentPage,
  setRemaining,
  selectRemaining,
} from "../../redux/app";
import { useDispatch, useSelector } from "react-redux";
import collection_image from "../../assets/images/collection_image.png";

const ConnectButton = styled(WalletDialogButton)`
  align-items: center !important;
  background-color: rgb(64, 250, 120) !important;
  border: 2px solid rgb(75, 53, 134) !important;
  border-radius: 15px !important;
  box-shadow: 0px 0px 10px 2px rgb(64, 250, 120) !important;
  color: rgb(75, 53, 134) !important;
  cursor: pointer !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  height: 50px !important;
  justify-content: center !important;
  margin: 5px !important;
  overflow: hidden !important;
  padding: 0 50px !important;
  padding-top: 3px !important;
  transition: border 0.185s ease-out !important;
  z-index: 3 !important;
`;
const CounterText = styled.span`
  font-size: 1.5rem;
`; // add your styles here
const MintContainer = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
`; // add your styles here
const MintButton = styled(Button)`
  align-items: center !important;
  background-color: rgb(64, 250, 120) !important;
  border: 2px solid rgb(75, 53, 134) !important;
  border-radius: 15px !important;
  box-shadow: 0px 0px 10px 2px rgb(64, 250, 120) !important;
  color: rgb(75, 53, 134) !important;
  cursor: pointer !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  height: 50px !important;
  justify-content: center !important;
  margin: 5px !important;
  overflow: hidden !important;
  padding: 0 50px !important;
  padding-top: 3px !important;
  transition: border 0.185s ease-out !important;
  z-index: 3 !important;
`; // add your styles here

const treasury = new anchor.web3.PublicKey(
  process.env.REACT_APP_TREASURY_ADDRESS!
);
const config = new anchor.web3.PublicKey(
  process.env.REACT_APP_CANDY_MACHINE_CONFIG!
);
const candyMachineId = new anchor.web3.PublicKey(
  process.env.REACT_APP_CANDY_MACHINE_ID!
);
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);
const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);
const txTimeout = 30000; // milliseconds (confirm this works for your project)

const projectShortName = process.env.REACT_APP_PROJECT_NAME_SHORT;
const projectFullName = process.env.REACT_APP_PROJECT_NAME_FULL;
const maxPerAddress = Number(process.env.REACT_APP_MAX_PER_ADDRESS);

const utcLaunch = 1635548400000; // 7pm EST Oct 29 - LAUNCH
// const utcLaunch = 1633943598000; // test
const launchDate = new Date(utcLaunch);

const Mint = () => {
  const [isActive, setIsActive] = useState(true); // true when countdown completes
  const [hideCountdown, setHideCountdown] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [minted, setMinted] = useState(0);
  const [txMinted, setTxMinted] = useState(0);
  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  const loading = useSelector(selectLoading);
  const addressFull = useSelector(selectAddress);
  const addressShort = shortenAddress(addressFull);
  const localString = addressFull + "-" + projectShortName;
  const itemsLeft = useSelector(selectRemaining);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(startDateSeed));
  const [amount, setAmount] = useState(1);

  const wallet = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  useEffect(() => {
    const minted = localStorage.getItem(localString);
    if (!minted) {
      setMinted(0);
    } else {
      setMinted(Number(minted));
    }
  }, [addressFull]);

  // Mint Function
  const onMint = async () => {
    if (Date.now() < utcLaunch) {
      alert(`${projectFullName} hasn't launched yet!`);
      return;
    }

    const itemsRequested = Number(amount);
    if (itemsRequested <= 0) {
      alert(`You must mint at least 1 ${projectFullName?.slice(0, -1)}`);
      return;
    }

    // if (Number(minted) >= maxPerAddress) {
    //   alert(`You can only mint ${maxPerAddress} ${projectFullName} per Address`);
    //   return;
    // }

    const allowed = maxPerAddress - minted - amount;
    if (allowed < 0) {
      const allowance = maxPerAddress - minted;
      if (allowance === 0) {
        alert(
          `Lookout!
          Maximum Mint: ${maxPerAddress} per address. 
          Minted: ${minted}. 
          You can't mint anymore with this address.`
        );
      } else {
        alert(
          `Lookout!
        Maximum Mint: ${maxPerAddress} per Address. 
        Minted: ${minted}. 
        You can mint ${allowance} more.`
        );
      }
      return;
    }

    dispatch(setLoading(true));
    setTxMinted(0);

    for (let i = 1; i <= itemsRequested; i++) {
      try {
        if (wallet.connected && candyMachine?.program && wallet.publicKey) {
          const mintTxId = await mintOneToken(
            candyMachine,
            config,
            wallet.publicKey,
            treasury
          );
          const status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            txTimeout,
            connection,
            "singleGossip",
            false
          );
          if (!status?.err) {
            setAlertState({
              open: true,
              message: "Congratulations! Mint succeeded!",
              severity: "success",
            });

            setTxMinted(i);

            const addressBalance = localStorage.getItem(localString);
            const addOne = Number(addressBalance) + 1;
            setMinted(addOne);
            localStorage.setItem(localString, addOne.toString());

            const anchorWallet = {
              publicKey: wallet.publicKey,
              signAllTransactions: wallet.signAllTransactions,
              signTransaction: wallet.signTransaction,
            } as anchor.Wallet;
            const { itemsRemaining } = await getCandyMachineState(
              anchorWallet,
              candyMachineId,
              connection
            );
            dispatch(setRemaining(itemsRemaining));
            if (itemsRemaining === 0) {
              setIsSoldOut(true);
            }
            // if (addOne >= ${maxPerAddress}) {
            //   alert(`You can only mint ${maxPerAddress} ${projectFullName} per Address`);
            //   dispatch(setLoading(false));
            //   return;
            // }
          } else {
            setAlertState({
              open: true,
              message: "Mint failed! Please try again!",
              severity: "error",
            });
          }
        }
      } catch (error: any) {
        let message = error.msg || "Minting failed! Please try again!";
        if (!error.msg) {
          if (error.message.indexOf("0x138")) {
          } else if (error.message.indexOf("0x137")) {
            message = `SOLD OUT!`;
          } else if (error.message.indexOf("0x135")) {
            message = `Insufficient funds to mint. Please fund your wallet.`;
          }
        } else {
          if (error.code === 311) {
            message = `SOLD OUT!`;
            setIsSoldOut(true);
          } else if (error.code === 312) {
            message = `Minting period hasn't started yet.`;
          }
        }
        setAlertState({
          open: true,
          message,
          severity: "error",
        });
      } finally {
        if (wallet?.publicKey) {
          const balance = await connection.getBalance(wallet?.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        }
      }
    }
    dispatch(setLoading(false));
  };

  // Set Address & Balance
  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        dispatch(setBalance(balance / LAMPORTS_PER_SOL));
        // setCompBalance(balance / LAMPORTS_PER_SOL);

        const address = wallet.publicKey?.toBase58() || "";
        dispatch(setAddress(address));
      }
    })();
  }, [wallet, connection]);

  //Set Connected
  useEffect(() => {
    (async () => {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !wallet.signTransaction
      ) {
        return;
      }

      const anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
      } as anchor.Wallet;

      const { candyMachine, goLiveDate, itemsRemaining } =
        await getCandyMachineState(anchorWallet, candyMachineId, connection);

      dispatch(setRemaining(itemsRemaining)); // LAUNCH_TODO: COMMENT IN
      // dispatch(setRemaining(7777)); // LAUNCH_TODO: COMMENT OUT
      setIsSoldOut(itemsRemaining === 0); // LAUNCH_TODO: CHANGE TO ===
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
      dispatch(setConnected(wallet.connected));
    })();
  }, [wallet, candyMachineId, connection]);

  useEffect(() => {
    dispatch(setCurrentPage("mint"));
  }, []);

  return (
    <div className="mint_container col-12 d-flex flex-column align-items-center">
      <div className="col-12 col-md-10 col-lg-8 mint_box d-flex flex-column align-items-center justify-content-center">
        <div className="minting_stats d-flex flex-row flex-wrap col-12 col-lg-10 justify-content-around align-items-center h-100">
          {wallet.connected && (
            <p>
              <span className="stat_header">Mint Price</span>
              <br />
              <span className="stat">1 SOL</span>
            </p>
          )}
          <MintContainer>
            {!wallet.connected ? (
              <ConnectButton>CONNECT</ConnectButton>
            ) : (
              <div className="">
                <div
                  className={`${loading && "d-none"} input_container col-12`}
                >
                  <input
                    type="number"
                    min="1"
                    max={maxPerAddress - minted}
                    placeholder={amount.toString()}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input_amount"
                  />
                </div>
                <div
                  className={`${
                    !loading && "d-none"
                  } input_container col-12 mt-3`}
                >
                  <h5 className="minted_amount">
                    Minted: {txMinted} of {amount}
                  </h5>
                </div>
                <MintButton
                  disabled={isSoldOut || loading || !isActive}
                  onClick={onMint}
                  variant="contained"
                >
                  {isSoldOut ? (
                    "SOLD OUT"
                  ) : isActive ? (
                    loading ? (
                      <CircularProgress />
                    ) : (
                      "mint"
                    )
                  ) : (
                    <Countdown
                      date={startDate}
                      onMount={({ completed }) =>
                        completed && setIsActive(true)
                      }
                      onComplete={() => setIsActive(true)}
                      renderer={renderCounter}
                    />
                  )}
                </MintButton>
              </div>
            )}
          </MintContainer>
          {wallet.connected && (
            <p>
              <span className="stat_header">Remaining</span>
              <br />
              <span className="stat">{itemsLeft.toLocaleString()}</span>
              {/* <span className="stat">6,666</span> */}
            </p>
          )}
        </div>
        <div className={hideCountdown ? "d-none" : ""}>
          <Countdown
            date={launchDate}
            onMount={({ completed }) => completed && setHideCountdown(true)}
            onComplete={() => setHideCountdown(true)}
            renderer={renderCounter}
          />
        </div>
      </div>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {days > 0 && `${days} days, `} {hours} hours, {minutes} minutes, {seconds}{" "}
      seconds
    </CounterText>
  );
};

export default Mint;
