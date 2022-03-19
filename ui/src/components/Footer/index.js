import React from "react";
import "./style.css";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { Link } from "react-router-dom";
import { links } from "../../constants/constants";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import discord_icon from "../../assets/icons/discord4.png";
import twitter_icon from "../../assets/icons/twitter1.png";
import email_icon from "../../assets/icons/email1.png";
import medium_icon from "../../assets/icons/medium1.png";
import { ReactComponent as MediumIcon } from "../../assets/images/medium.svg";
import solens_logo from "../../assets/images/logo2.png";

export default function Footer(props) {
  const year = new Date().getFullYear();

  const pg_break = (
    <div className="d-flex d-lg-none justify-content-center col-12">
      <hr style={{ color: "white", width: "50%" }} className="" />
    </div>
  );

  return (
    <div className="footer col-12 d-flex flex-column justify-content-between align-items-center">
      <div className="footer_content col-12 d-flex flex-row flex-wrap justify-content-around justify-content-lg-center align-items-start mb-0 mb-lg-3">
        <div className="footer_logo_section col-12 col-lg-4 d-flex flex-column align-items-center justify-content-center justify-content-lg-start justify-content-xxl-center">
          <img
            src={solens_logo}
            className="footer_logo"
            alt="solens logo"
            loading="lazy"
          />
          <div className="col-10 col-xl-4 d-flex justify-content-between mt-1">
            <div className="icon_link">
              <a
                href={links.discord.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={discord_icon}
                  style={{ height: "1.1rem" }}
                  className="icon_link"
                />
              </a>
            </div>
            <div className="icon_link">
              <a
                href={links.twitter.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                {/* <TwitterIcon style={{ fill: "white" }} className="icon_link" /> */}
                <img
                  src={twitter_icon}
                  style={{ height: "1.1rem" }}
                  className="icon_link"
                />
              </a>
            </div>
            <div className="icon_link">
              <a
                href={links.medium.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={medium_icon}
                  style={{ height: "1.1rem" }}
                  className="icon_link"
                />
                {/* <MediumIcon style={{ fill: "white" }} className="icon_link" /> */}
              </a>
            </div>
            <div className="icon_link">
              <a
                href={links.email.contact}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={email_icon}
                  style={{ height: "1.1rem" }}
                  className="icon_link"
                />
                {/* <EmailIcon style={{ fill: "white" }} /> */}
              </a>
            </div>
          </div>
        </div>

        {pg_break}

        <div className="footer_section col-12 col-lg-2 d-flex flex-column justify-content-around align-items-center align-items-lg-start mb-2 mb-lg-0">
          <h4 className="footer_title">SITEMAP</h4>

          <Link to="/" style={{ textDecoration: "none" }}>
            <h4 className="footer_link">home</h4>
          </Link>
          <Link to="/collections" style={{ textDecoration: "none" }}>
            <h4 className="footer_link">collections</h4>
          </Link>
          <Link to="/wallets" style={{ textDecoration: "none" }}>
            <h4 className="footer_link">wallets</h4>
          </Link>
          <Link to="/launch" style={{ textDecoration: "none" }}>
            <h4 className="footer_link">launchzone</h4>
          </Link>
        </div>

        {pg_break}

        <div className="footer_section col-12 col-lg-2 d-flex flex-column justify-content-around align-items-center align-items-lg-start mb-2 mb-lg-0">
          <h4 className="footer_title">CONNECT</h4>

          <a
            href={links.twitter.url}
            target="_blank"
            style={{
              textDecoration: "none",
            }}
          >
            <h1 className="footer_link">twitter</h1>
          </a>
          <a
            href={links.medium.url}
            target="_blank"
            style={{
              textDecoration: "none",
            }}
          >
            <h1 className="footer_link">medium</h1>
          </a>
          <a
            href={links.email.contact}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <h4 className="footer_link">inquiries</h4>
          </a>
          <a
            href={links.getListed}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <h4 className="footer_link">get listed</h4>
          </a>
        </div>

        {pg_break}
      </div>

      {/* <div className="col-6 col-lg-2 col-xxl-1 d-flex justify-content-between mt-2 mt-lg-0 mb-2 mb-lg-4">
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

      <div className="copyright col-12 d-flex align-items-end justify-content-center">
        <CopyrightIcon className="copyright_icon" />
        <span>{year} Solens. All Rights Reserved.</span>
      </div>
    </div>
  );
}
