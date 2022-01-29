import * as anchor from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  CANDY_MACHINE_PROGRAM_V2_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from "./candyConstants";
import { SystemProgram } from "@solana/web3.js";

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
  candyMachine: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("candy_machine"), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID
  );
};

export async function mintToken(
  payer: anchor.web3.PublicKey,
  candyMachine: anchor.web3.PublicKey,
  wallet: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey,
  program: anchor.Program
) {
  let [userTokenAccountAddress, bump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [payer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

  const metadataAddress = await getMetadata(mint);
  const masterEdition = await getMasterEdition(mint);

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
    candyMachine
  );

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

  instructions.push(
    await program.instruction.mintNft(creatorBump, {
      accounts: {
        candyMachine: candyMachine,
        candyMachineCreator,
        payer: payer,
        wallet: wallet,
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
        recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      remainingAccounts:
        remainingAccounts.length > 0 ? remainingAccounts : undefined,
    })
  );

  return instructions;
}
