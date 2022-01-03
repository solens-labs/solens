import React, { useState } from "react";
import { ReactComponent as Menu } from "../../assets/icons/menu.svg";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import "./style.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { selectAddress, selectConnected } from "../../redux/network";
import { links } from "../../constants/constants";
import logo2 from "../../assets/images/logo2.png";
import { selectCurrentPage } from "../../redux/app";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import twitter from "../../assets/images/twitter.svg";
import discord from "../../assets/images/discord.svg";

const Header = (props) => {
  //   const connected = useSelector(selectConnected);
  //   const address = useSelector(selectAddress);
  //   const address_short = "0x..." + address.slice(-4);
  const currentPage = useSelector(selectCurrentPage);

  const activePage = (page) => {
    if (currentPage === page) {
      return "nav-link-active";
    }
  };

  const [menu, setMenu] = useState(false);
  const showMenu = () => {
    setMenu(!menu);
  };

  return (
    <nav className="navbar">
      <div className="col-2">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="logo_container">
            <img src={logo2} className="nav_logo" alt="logo" />
            {/* <h1 className="app_title">SOLENS</h1> */}
          </div>
        </Link>
      </div>

      <div className="d-none d-lg-flex col-lg-8 flex-wrap justify-content-center align-items-center">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="nav_link_container">
            <h1 className="nav_link">home</h1>
          </div>
        </Link>
        <Link to="/collections" style={{ textDecoration: "none" }}>
          <div className="nav_link_container">
            <h1 className="nav_link">collections</h1>
          </div>
        </Link>
        <Link to="/wallets" style={{ textDecoration: "none" }}>
          <div className="nav_link_container">
            <h1 className="nav_link">wallets</h1>
          </div>
        </Link>
        {/* <Link to="/launch" style={{ textDecoration: "none" }}>
          <h1 className="nav_link">launchzone</h1>
        </Link> */}
      </div>

      <div className="col-2 d-none d-lg-flex justify-content-end">
        <div className="icon_link">
          <a
            href={links.twitter.url}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            {/* <h1 className="nav_link">twitter</h1> */}
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
          <div className="col-6 d-flex flex-row justify-content-center">
            <div className="icon_link">
              <a
                href={links.email.contact}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <EmailIcon style={{ fill: "white" }} />
              </a>
            </div>
            <div className="icon_link">
              <a
                href={links.twitter.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                {/* <h1 className="nav_link">twitter</h1> */}
                <TwitterIcon style={{ fill: "white" }} />
              </a>
            </div>
          </div>

          <div className="col-6 d-flex flex-column justify-content-between">
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
            {/* <a
              href={links.twitter.url}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <h1 className="nav_link">twitter</h1>
            </a> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
