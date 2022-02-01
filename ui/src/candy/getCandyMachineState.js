import { CandyIDL, Solens_Candy_Machine } from "./candyConstants";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const getCandyMachineState = async (
  connection,
  wallet,
  collectionInfo
) => {
  const provider = new anchor.Provider(connection, wallet, {
    preflightCommitment: "processed",
    commitment: "confirmed",
  });
  const candyMachine = new anchor.web3.PublicKey(
    collectionInfo?.candyMachineID
  );
  const program = new anchor.Program(CandyIDL, Solens_Candy_Machine, provider);
  const candyMachineState = await program.account.candyMachine.fetch(
    candyMachine
  );
  const price = candyMachineState.data.price.toNumber() / LAMPORTS_PER_SOL;
  const goLiveDate = new Date(candyMachineState.data.goLiveDate * 1000);

  const itemsTotal = candyMachineState.data.itemsAvailable.toNumber();
  const itemsMinted = candyMachineState.itemsRedeemed.toNumber();
  const itemsPreminted = collectionInfo?.preminted;
  const itemsRemaining = itemsTotal - itemsMinted;
  const totalMinted = itemsMinted + itemsPreminted;
  const progress = (totalMinted / collectionInfo?.supply) * 100;
  const launchTime = candyMachineState.data.goLiveDate * 1000;
  const launchDate = new Date(launchTime);

  return {
    itemsRemaining: itemsRemaining,
    itemsMintedAndPreminted: totalMinted,
    progress: progress,
    launchDate: launchDate,
  };
};
