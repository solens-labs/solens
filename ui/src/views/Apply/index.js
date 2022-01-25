import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { links } from "../../constants/constants";
import { Helmet } from "react-helmet";

export default function Listing(props) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    window.open(links.getListed, "_blank") ||
      window.location.replace(links.getListed);
    setOpened(true);
  }, []);

  return (
    <div className="col-12 d-flex flex-row flex-wrap justify-content-center align-items-center h-100">
      <Helmet>
        <title>Solens - Submit Collection</title>
        <meta
          name="description"
          content="Submit your collection to get listed on Solana's premier NFT Marketplex."
        />
      </Helmet>
      <h1>Redirecting to Listing Form...</h1>
      {opened && <Redirect to="/" />}
    </div>
  );
}
