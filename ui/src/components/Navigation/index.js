import React, { useEffect, useState } from "react";
import { ReactComponent as Menu } from "../../assets/icons/menu.svg";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import "./style.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { selectAddress, selectConnected } from "../../redux/network";
import { links } from "../../constants/constants";
import logo2 from "../../assets/images/logo2.png";
import {
  selectAddress,
  selectBalance,
  setConnected,
  setAddress,
  setBalance,
  selectConnected,
  selectCurrentPage,
} from "../../redux/app";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import twitter from "../../assets/images/twitter.svg";
import discord from "../../assets/images/discord.svg";
import { ReactComponent as MediumIcon } from "../../assets/images/medium.svg";
import { connect_button } from "../Buttons";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import solens_symbol from "../../assets/images//logo3.png";

const Navigation = (props) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const dispatch = useDispatch();

  const getSolBalance = async (wallet) => {
    const balance = await connection.getBalance(wallet.publicKey);
    const converted = balance / LAMPORTS_PER_SOL;
    return converted;
  };

  // Get address & balance on wallet connect
  useEffect(() => {
    if (wallet.connected && wallet.publicKey && !wallet.disconnecting) {
      console.log(wallet);
      dispatch(setAddress(wallet.publicKey.toString()));
      dispatch(setConnected(true));
      const solBalance = getSolBalance(wallet).then((result) => {
        console.log(result);
        dispatch(setBalance(result));
      });
    } else {
      dispatch(setAddress(""));
      dispatch(setConnected(false));
      dispatch(setBalance(0));
    }
  }, [wallet]);

  // const address = useSelector(selectAddress);
  //   const address_short = "0x..." + address.slice(-4);
  // const currentPage = useSelector(selectCurrentPage);

  // const activePage = (page) => {
  //   if (currentPage === page) {
  //     return "nav-link-active";
  //   }
  // };

  const [menu, setMenu] = useState(false);
  const showMenu = () => {
    setMenu(!menu);
  };

  return (
    <nav className="navbar d-flex flex-row justify-content-between">
      <div className="col-4 col-lg-2  d-flex justify-content-start">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={logo2} className="nav_logo" alt="logo" />
        </Link>
      </div>

      <div className="d-none d-lg-flex col-lg-7 col-xl-6 col-xxl-5 flex-wrap justify-content-around align-items-center">
        <div className="nav_link_container">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 className="nav_link">home</h1>
          </Link>
        </div>
        <div className="nav_link_container">
          <Link to="/collections" style={{ textDecoration: "none" }}>
            <h1 className="nav_link">collections</h1>
          </Link>
        </div>
        <div className="nav_link_container">
          <Link to="/wallets" style={{ textDecoration: "none" }}>
            <h1 className="nav_link">wallets</h1>
          </Link>
        </div>
        <div className="nav_link_container">
          <Link to="/launch" style={{ textDecoration: "none" }}>
            <h1 className="nav_link">launchzone</h1>
          </Link>
        </div>
      </div>

      {/* <div className="col-lg-2 col-xxl-1 d-none d-lg-flex justify-content-between">
        <div className="icon_link">
          <a
            href={links.medium.url}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <MediumIcon style={{ fill: "white" }} className="icon_link" />
          </a>
        </div>
        <div className="icon_link">
          <a
            href={links.twitter.url}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <TwitterIcon style={{ fill: "white" }} className="icon_link" />
          </a>
        </div>
        <div className="icon_link">
          <a
            href={links.email.contact}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <EmailIcon style={{ fill: "white" }} />
          </a>
        </div>
      </div> */}

      <div className="col-lg-2  d-none d-lg-flex justify-content-end">
        {/* {connect_button} */}
        <WalletModalProvider className="wallet_modal" logo={solens_symbol}>
          <WalletMultiButton
            className="connect_button"
            style={{
              border: "1px solid black",
              color: "white",
              borderRadius: 15,
            }}
          />
        </WalletModalProvider>
      </div>

      {!menu && (
        <div onClick={showMenu} className="menu_icon">
          <Menu />
        </div>
      )}

      {menu && <Close onClick={() => setMenu(false)} className="close_icon" />}

      <div
        className={`${
          menu && "active"
        } slide-menu d-flex justify-content-between`}
      >
        <div className="mobile_menu">
          <div className="col-12 d-flex flex-column align-items-end">
            <Link to="/" style={{ textDecoration: "none" }}>
              <h1 className="nav_link" onClick={() => showMenu()}>
                home
              </h1>
            </Link>
            <Link to="/collections" style={{ textDecoration: "none" }}>
              <h1 className="nav_link" onClick={() => showMenu()}>
                collections
              </h1>
            </Link>
            <Link to="/wallets" style={{ textDecoration: "none" }}>
              <h1 className="nav_link" onClick={() => showMenu()}>
                wallets
              </h1>
            </Link>
            <Link to="/launch" style={{ textDecoration: "none" }}>
              <h1 className="nav_link" onClick={() => showMenu()}>
                launchzone
              </h1>
            </Link>
            <div className="d-flex flex-row col-4 justify-content-around">
              <a
                href={links.twitter.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <TwitterIcon style={{ fill: "white" }} className="icon_link" />
              </a>

              <a
                href={links.medium.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <MediumIcon style={{ fill: "white" }} className="icon_link" />
              </a>

              <a
                href={links.email.contact}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <EmailIcon style={{ fill: "white" }} className="icon_link" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
