import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const getTokenAccounts = async (wallet, connection) => {
  const { value } = await connection.getParsedTokenAccountsByOwner(
    wallet.publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );
  return value;
};

export default getTokenAccounts;
