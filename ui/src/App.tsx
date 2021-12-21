import "./App.css";
import { useEffect, useMemo } from "react";

import Home from "./views/Home";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { BrowserRouter as Router } from "react-router-dom";
import ReactGA from "react-ga";

ReactGA.initialize("UA-215619609-1");
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [getPhantomWallet(), getSolflareWallet(), getSolletWallet()],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletDialogProvider>
          <Router>
            <Home />
          </Router>
        </WalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
