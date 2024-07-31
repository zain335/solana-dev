import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

export const connection = new Connection(clusterApiUrl("devnet"));

export const isValidAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

export const getBalance = async (address: string): Promise<number> => {
  const balanceInLamports = await connection.getBalance(new PublicKey(address));
  const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
  return balanceInSOL;
};
