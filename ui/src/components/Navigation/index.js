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
      <div className="col-3">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="logo_container">
            <img src={logo2} className="nav_logo" alt="logo" />
            {/* <h1 className="app_title">SOLENS</h1> */}
          </div>
        </Link>
      </div>

      <div className="d-none d-lg-flex col-lg-9 flex-wrap justify-content-end">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 className="nav_page">HOME</h1>
        </Link>
        <Link to="/collections" style={{ textDecoration: "none" }}>
          <h1 className="nav_page">COLLECTIONS</h1>
        </Link>
        <a
          href={links.twitter.url}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <h1 className="nav_page">TWITTER</h1>
        </a>
      </div>

      {/* <div className="d-none d-lg-block col-2 social_links">
        <button
          className="collection_stat"
          style={{
            border: "1px solid black",
            color: "white",
            marginLeft: "20px",
          }}
        >
          Connect Wallet
        </button>
      </div> */}

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
          {/* <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo2}
              className="nav_logo nav_logo_mobile"
              alt="logo"
              onClick={() => showMenu()}
            />
          </Link> */}

          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 className="nav_page" onClick={() => showMenu()}>
              Home
            </h1>
          </Link>
          <Link to="/collections" style={{ textDecoration: "none" }}>
            <h1 className="nav_page" onClick={() => showMenu()}>
              Collections
            </h1>
          </Link>
          <a
            href={links.twitter.url}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <h1 className="nav_page" onClick={() => showMenu()}>
              Twitter
            </h1>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
