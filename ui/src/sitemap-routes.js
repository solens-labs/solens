import React from "react";
import { Route } from "react-router";

export default (
  <Route>
    <Route path="/" />
    <Route path="/collections" />
    <Route path="/wallets" />
    <Route path="/apply" />
    <Route path="/user" />
    <Route path="/launch" />
    <Route path="/collection/:name" />
    <Route path="/mint/:address" />
    <Route path="/nfts/:name" />
  </Route>
);
