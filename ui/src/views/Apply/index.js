import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { links } from "../../constants/constants";

export default function Listing(props) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    window.open(links.getListed, "_blank") ||
      window.location.replace(links.getListed);
    setOpened(true);
  }, []);

  return (
    <div className="col-12 d-flex flex-row flex-wrap justify-content-center align-items-center h-100">
      <h1>Redirecting to Listing Form...</h1>
      {opened && <Redirect to="/" />}
    </div>
  );
}
