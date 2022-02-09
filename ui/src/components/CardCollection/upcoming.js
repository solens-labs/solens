import React from "react";
import "./style.css";
import TwitterIcon from "@mui/icons-material/Twitter";
import WebsiteIcon from "@mui/icons-material/Language";
import DiscordIcon from "../../assets/images/discord.svg";
import { Link } from "react-router-dom";

export default function CollectionCard(props) {
  const { collection, key } = props;

  const symbol = collection?.symbol;
  const now = new Date();
  let launchDate = new Date(collection?.launchDate);

  if (now > launchDate) {
    launchDate = "Minting Live!";
  } else {
    launchDate = launchDate.toLocaleDateString();
  }

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-center p-1 pb-0 pt-0 mb-4">
      <div
        className="collection_card d-flex flex-column justify-content-between mt-3"
        key={key || 0}
      >
        <div className="collection_image_container">
          <Link to={`/launch/${symbol}`}>
            <img
              src={collection?.image}
              alt="nft collection image"
              className="collection_card_image"
            />
          </Link>
        </div>

        <div className="collection_card_details d-flex flex-column justify-content-center align-items-center">
          <h2 className="collection_card_title">{collection?.name}</h2>
          <h1 className="collection_info_header2">{launchDate}</h1>
        </div>

        {/* <div className="collection_card_stat col-12 d-flex flex-column align-items-center">
        <div className="d-flex justify-content-center col-12">
          <hr
            style={{
              color: "white",
              width: "50%",
              padding: "0px",
              margin: "0px 0px 10px 0px",
            }}
          />
        </div>
        <div className="d-flex justify-content-around col-6">
          {collection?.website && (
            <a
              href={collection?.website}
              target="_blank"
              aria-label="website link"
              style={{ textDecoration: "none", color: "white" }}
            >
              <WebsiteIcon />
            </a>
          )}

          {collection?.twitter && (
            <a
              href={collection?.twitter}
              target="_blank"
              aria-label="twitter link"
              style={{ textDecoration: "none", color: "white" }}
            >
              <TwitterIcon />
            </a>
          )}

          {collection?.discord && (
            <a
              href={collection.discord}
              target="_blank"
              aria-label="website link"
              style={{ textDecoration: "none", color: "white" }}
            >
              <img src={DiscordIcon} style={{ height: "1.2rem" }} />
            </a>
          )}
        </div>
      </div> */}
      </div>
    </div>
  );
}
