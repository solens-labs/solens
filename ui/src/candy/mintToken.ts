import * as anchor from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Solens_Candy_Machine,
  TOKEN_METADATA_PROGRAM_ID,
} from "./candyConstants";
import { SystemProgram, Transaction } from "@solana/web3.js";

const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

const getMasterEdition = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

const getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey,
  programID: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("candy_machine"), candyMachine.toBuffer()],
    programID
  );
};

export async function mintToken(
  payer: anchor.web3.PublicKey,
  candyMachineAddress: anchor.web3.PublicKey,
  wallet: anchor.web3.PublicKey,
  raise: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey,
  wlMint: anchor.web3.PublicKey,
  wlTokenAccount: anchor.web3.PublicKey,
  program: anchor.Program
) {
  let [userTokenAccountAddress, _] =
    await anchor.web3.PublicKey.findProgramAddress(
      [payer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

  const metadataAddress = await getMetadata(mint);
  const masterEdition = await getMasterEdition(mint);

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
    candyMachineAddress,
    program.programId
  );

  // const candyMachine: any = await program.account.candyMachine.fetch(
  //   candyMachineAddress,
  // );

  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint,
      space: MintLayout.span,
      lamports:
        await program.provider.connection.getMinimumBalanceForRentExemption(
          MintLayout.span
        ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint, 0, payer, payer),
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      userTokenAccountAddress,
      payer,
      payer
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint,
      userTokenAccountAddress,
      payer,
      [],
      1
    ),
  ];

  let remainingAccounts: any = [];

  if (wlMint) {
    if (!wlTokenAccount) {
      wlTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        wlMint,
        payer,
        false
      );

      // try {
      //   await program.provider.connection.getAccountInfo(wlTokenAccount);
      // } catch (err) {
      //   const FAILED_TO_FIND_ACCOUNT = "Failed to find account";
      //   const INVALID_ACCOUNT_OWNER = "Invalid account owner";

      //   if (
      //     // @ts-ignore
      //     err.message === FAILED_TO_FIND_ACCOUNT ||
      //     // @ts-ignore
      //     err.message === INVALID_ACCOUNT_OWNER
      //   ) {
      //     let createATAix = await Token.createAssociatedTokenAccountInstruction(
      //       ASSOCIATED_TOKEN_PROGRAM_ID,
      //       TOKEN_PROGRAM_ID,
      //       wlMint,
      //       wlTokenAccount,
      //       payer,
      //       payer
      //     );

      //     instructions.push(createATAix);
      //   }
      //   console.log(err);
      // }
    }

    remainingAccounts.push({
      pubkey: wlTokenAccount,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: wlMint,
      isWritable: false,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: payer,
      isWritable: false,
      isSigner: true,
    });
  }

  let slothash = new anchor.web3.PublicKey(
    "SysvarS1otHashes111111111111111111111111111"
  );

  instructions.push(
    await program.instruction.mintNft(creatorBump, {
      accounts: {
        candyMachine: candyMachineAddress,
        candyMachineCreator,
        payer: payer,
        wallet: wallet,
        raise: raise,
        mint: mint,
        metadata: metadataAddress,
        masterEdition,
        mintAuthority: payer,
        updateAuthority: payer,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: slothash,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      remainingAccounts:
        remainingAccounts.length > 0 ? remainingAccounts : undefined,
    })
  );

  const final_tx = new Transaction({
    feePayer: payer,
  });

  final_tx.add(...instructions);
  return final_tx;
}
