import React from "react";
import "./style.css";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { Link } from "react-router-dom";
import { links } from "../../constants/constants";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import solens_logo from "../../assets/images/logo2.png";

export default function Footer(props) {
  const year = new Date().getFullYear();

  return (
    <div className="footer col-12 d-flex flex-column justify-content-between align-items-center">
      <div className="col-12 d-flex justify-content-center pt-3">
        <img src={solens_logo} className="footer_logo" />
      </div>

      <div className="footer_content col-12 d-flex flex-row flex-wrap justify-content-center mb-4">
        <div className="d-flex d-md-none justify-content-center col-12">
          <hr style={{ color: "white", width: "50%" }} className="" />
        </div>

        <div className="footer_section col-12 col-md-3 d-flex flex-column align-items-center justify-content-around mb-2 mb-lg-0">
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
        </div>

        <div className="d-flex d-md-none justify-content-center col-12">
          <hr style={{ color: "white", width: "50%" }} className="" />
        </div>

        <div className="footer_section col-12 col-md-3 d-flex flex-column align-items-center justify-content-around mb-2 mb-lg-0">
          <h4 className="footer_title">CONNECT</h4>
          <div className="d-flex flex-row">
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
          <a
            href={links.getListed}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <h4 className="footer_link">get listed</h4>
          </a>
          <a
            href={links.email.contact}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <h4 className="footer_link">inquiries</h4>
          </a>
        </div>

        <div className="d-flex d-md-none justify-content-center col-12 mb-3">
          <hr style={{ color: "white", width: "50%" }} className="" />
        </div>
      </div>

      <div className="copyright col-12 d-flex align-items-end justify-content-center">
        <CopyrightIcon className="copyright_icon" />
        <span>{year} Solens. All Rights Reserved.</span>
      </div>
    </div>
  );
}
