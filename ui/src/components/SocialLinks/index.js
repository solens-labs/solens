import React from "react";
import "./style.css";

export default function SocialLinks(props) {
  const { links } = props;

  return (
    <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
      {links.website ? (
        <a
          href={links.website}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <h5 className="collection_link">Website</h5>
        </a>
      ) : (
        ""
      )}
      {links.twitter ? (
        <a
          href={links.twitter}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <h5 className="collection_link">Twitter</h5>
        </a>
      ) : (
        ""
      )}
      {links.discord ? (
        <a
          href={links.discord}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <h5 className="collection_link">Discord</h5>
        </a>
      ) : (
        ""
      )}
    </div>
  );
}
