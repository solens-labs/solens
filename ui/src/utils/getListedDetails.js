import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { api, queries } from "../constants/constants";
import { getEscrowAccountInfo, Solanart } from "../exchanges/solanart";

export const getListedInfoFromBackend = async (address) => {
  const apiRequest =
    api.server.listings + queries.symbol + "none" + queries.mint + address;

  const itemDetailFetch = axios.get(apiRequest).then((response) => {
    const itemDetailsFromBackend = response?.data[0];
    if (
      itemDetailsFromBackend &&
      Object.keys(itemDetailsFromBackend)?.length > 1
    ) {
      return itemDetailsFromBackend;
    } else {
      return undefined;
    }
  });

  const resolved = await Promise.resolve(itemDetailFetch);
  return resolved;
};

export const getListedInfoFromChain = async (address) => {
  try {
    let itemDetailsFromChain = {};
    let mintKey = {};
    try {
      mintKey = new PublicKey(address);
    } catch {
      return;
    }
    let [escrowAccount, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("sale"), mintKey.toBuffer()],
      Solanart
    );
    let escrowAccountInfo = await getEscrowAccountInfo(escrowAccount);
    if (!escrowAccountInfo) {
      return;
    } else {
      const maker = escrowAccountInfo.maker;
      const price = escrowAccountInfo.price.toNumber() / LAMPORTS_PER_SOL;
      const escrowTokenAccount = escrowAccountInfo.escrowTokenAccount;

      itemDetailsFromChain = {
        owner: maker,
        price: price,
        escrowTokenAccount: escrowTokenAccount,
        marketplace: "solanart",
        mint: address,
      };

      return itemDetailsFromChain;
    }
  } catch (e) {
    console.log("Error fetching itemDetailsFromChain.");
  }
};
