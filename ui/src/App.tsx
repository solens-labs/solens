import "./App.css";
import { useEffect, useMemo } from "react";

import Base from "./views/Base/index.js";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getLedgerWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { BrowserRouter as Router } from "react-router-dom";
import ReactGA from "react-ga";
import solens_symbol from "./assets/images/logo2.png";

ReactGA.initialize("UA-215619609-1");
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const App = () => {
  const endpoint = process.env.REACT_APP_SOLANA_RPC_HOST as string;

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSolletWallet(),
      // getLedgerWallet(),
    ],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider className="wallet_modal" logo={solens_symbol}>
          <Router>
            <Base />
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
