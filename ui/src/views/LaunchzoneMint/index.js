import React, { useState, useEffect } from "react";
import "./style.css";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { mintToken } from "../../utils/mintToken";

export default function LaunchzoneMint(props) {
  const { name } = useParams();

  return (
    <>
      <h1>hello</h1>
    </>
  );
}
