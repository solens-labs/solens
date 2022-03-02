import React, { useEffect, useState } from "react";
import { ReactComponent as Menu } from "../../assets/icons/menu.svg";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import "./style.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { selectAddress, selectConnected } from "../../redux/network";
import { links, themeColors } from "../../constants/constants";
import logo2 from "../../assets/images/logo2.png";
import { setConnected, setAddress, setBalance } from "../../redux/app";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import twitter from "../../assets/images/twitter.svg";
import discord from "../../assets/images/discord.svg";
import { ReactComponent as MediumIcon } from "../../assets/images/medium.svg";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CollectionsIcon from "@mui/icons-material/Collections";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import ListIcon from "@mui/icons-material/List";
import ListIcon from "@mui/icons-material/AutoGraph";
import HomeIcon from "@mui/icons-material/Home";

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
      dispatch(setAddress(wallet.publicKey.toString()));
      dispatch(setConnected(true));
      const solBalance = getSolBalance(wallet).then((result) => {
        dispatch(setBalance(result));
      });
    } else {
      dispatch(setAddress(""));
      dispatch(setConnected(false));
      dispatch(setBalance(0));
    }
  }, [wallet]);

  const [menu, setMenu] = useState(false);
  const showMenu = () => {
    setMenu(!menu);
  };

  // const iconsFill = themeColors[4];
  const iconsFill = "rgba(179, 87, 156, 0.7)";
  // const iconsFill = "white";

  return (
    <>
      {/* <div className="maintenance col-12 d-flex justify-content-center">
        Website under maintenance. Some stats may be delayed.
      </div> */}
      <nav className="navbar d-flex flex-row justify-content-between align-items-center">
        <div className="col-4 col-lg-2 d-flex justify-content-start">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo2}
              className="nav_logo"
              alt="solens logo"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="col-lg-6 d-none d-lg-flex justify-content-around align-items-center">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="nav_link_container">
              <div className="d-none d-lg-block">
                <HomeIcon
                  fontSize={"medium"}
                  className="nav_icon"
                  style={{ fill: iconsFill }}
                />
              </div>
              <h1 className="p-2 pt-0 pb-0 nav_link d-none d-xxl-block">
                home
              </h1>
            </div>
          </Link>
          <Link to="/launch" style={{ textDecoration: "none" }}>
            <div className="nav_link_container ">
              <div className="d-none d-lg-block">
                <RocketLaunchIcon
                  fontSize={"medium"}
                  className="nav_icon"
                  style={{ fill: iconsFill }}
                />
              </div>
              <h1 className="p-2 pt-0 pb-0 nav_link d-none d-xxl-block">
                launchzone
              </h1>
            </div>
          </Link>
          <Link to="/collections" style={{ textDecoration: "none" }}>
            <div className="nav_link_container">
              <div className="d-none d-lg-block">
                <CollectionsIcon
                  fontSize={"medium"}
                  className="nav_icon"
                  style={{ fill: iconsFill }}
                />
              </div>
              <h1 className="p-2 pt-0 pb-0 nav_link d-none d-xxl-block">
                collections
              </h1>
            </div>
          </Link>
          <Link to="/wallets" style={{ textDecoration: "none" }}>
            <div className="nav_link_container ">
              <div className="d-none d-lg-block">
                <AccountBalanceWalletIcon
                  fontSize={"medium"}
                  className="nav_icon"
                  style={{ fill: iconsFill }}
                />
              </div>
              <h1 className="p-2 pt-0 pb-0 nav_link d-none d-xxl-block">
                wallets
              </h1>
            </div>
          </Link>
          <Link to="/user" style={{ textDecoration: "none" }}>
            <div className="nav_link_container ">
              <div className="d-none d-lg-block">
                <AccountCircleOutlinedIcon
                  fontSize={"medium"}
                  className="nav_icon"
                  style={{ fill: iconsFill }}
                />
              </div>
              <h1 className="p-2 pt-0 pb-0 nav_link d-none d-xxl-block">
                sell
              </h1>
            </div>
          </Link>
        </div>

        <div className="col-lg-2 d-none d-lg-flex justify-content-end align-items-center">
          {/* <Link to="/user" style={{ textDecoration: "none", color: "white" }}>
          <AccountCircleOutlinedIcon style={{ marginRight: 20 }} />
        </Link> */}

          <WalletMultiButton
            className="connect_button"
            style={{
              border: "1px solid black",
              color: "white",
              borderRadius: 15,
            }}
          />
        </div>

        {!menu && (
          <div onClick={showMenu} className="menu_icon">
            <Menu />
          </div>
        )}

        {menu && (
          <Close onClick={() => setMenu(false)} className="close_icon" />
        )}

        <div
          className={`${
            menu && "active"
          } slide-menu d-flex justify-content-between`}
        >
          <div className="mobile_menu">
            <div className="col-12 d-flex flex-column align-items-end">
              <Link to="/" style={{ textDecoration: "none" }}>
                <div className="col-12 d-flex">
                  <h1 className="nav_link" onClick={() => showMenu()}>
                    home
                  </h1>
                  <div className="p-1 pt-0 pb-1 pr-0">
                    <HomeIcon
                      fontSize={"small"}
                      className="nav_icon"
                      style={{ fill: iconsFill }}
                    />
                  </div>
                </div>
              </Link>
              <Link to="/launch" style={{ textDecoration: "none" }}>
                <div className="col-12 d-flex">
                  <h1 className="nav_link" onClick={() => showMenu()}>
                    launchzone
                  </h1>
                  <div className="p-1 pt-0 pb-1 pr-0">
                    <RocketLaunchIcon
                      fontSize={"small"}
                      className="nav_icon"
                      style={{ fill: iconsFill }}
                    />
                  </div>
                </div>
              </Link>
              <Link to="/collections" style={{ textDecoration: "none" }}>
                <div className="col-12 d-flex">
                  <h1 className="nav_link" onClick={() => showMenu()}>
                    collections
                  </h1>
                  <div className="p-1 pt-0 pb-1 pr-0">
                    <CollectionsIcon
                      fontSize={"small"}
                      className="nav_icon"
                      style={{ fill: iconsFill }}
                    />
                  </div>
                </div>
              </Link>
              <Link to="/wallets" style={{ textDecoration: "none" }}>
                <div className="col-12 d-flex">
                  <h1 className="nav_link" onClick={() => showMenu()}>
                    wallets
                  </h1>
                  <div className="p-1 pt-0 pb-1 pr-0">
                    <AccountBalanceWalletIcon
                      fontSize={"small"}
                      className="nav_icon"
                      style={{ fill: iconsFill }}
                    />
                  </div>
                </div>
              </Link>
              <Link to="/user" style={{ textDecoration: "none" }}>
                <div className="col-12 d-flex">
                  <h1 className="nav_link" onClick={() => showMenu()}>
                    sell
                  </h1>
                  <div className="p-1 pt-0 pb-1 pr-0">
                    <AccountCircleOutlinedIcon
                      fontSize={"small"}
                      className="nav_icon"
                      style={{ fill: iconsFill }}
                    />
                  </div>
                </div>
              </Link>
              <div className="d-flex flex-row col-6 justify-content-around">
                <a
                  href={links.twitter.url}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <TwitterIcon
                    style={{ fill: "white" }}
                    className="icon_link"
                  />
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
    </>
  );
};

export default Navigation;
