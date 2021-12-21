import React from "react";
import "../Buttons.css";
import { links } from "../../constants/constants";

export default function Twitter(props) {
  return (
    <div className="social-buttons d-flex flex-row justify-content-center">
      <a href={links.twitter.url} target="_blank" className="">
        <button className="btn-button btn-accent">twitter</button>
      </a>
      <a href={links.discord.url} target="_blank" className="">
        <button className="btn-button btn-accent">discord</button>
      </a>
      {/* <a href={links.medium} target="_blank">
        <button className="btn-accent">medium</button>
      </a>
      <a href={links.opensea} target="_blank">
        <button className="btn-accent">opensea</button>
      </a> */}
    </div>
  );
}
