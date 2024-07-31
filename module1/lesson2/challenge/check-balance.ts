import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import "dotenv/config";
import { isValidAddress } from "../../utils";

const checkBalance = async (address: string) => {
  try {
    if (!isValidAddress(address)) throw new Error("Invalid Public key");

    const publicKey = new PublicKey(address);

    const connection = new Connection(clusterApiUrl("mainnet-beta"));

    const balanceInLamports = await connection.getBalance(publicKey);

    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

    console.log(
      `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
    );
  } catch (error: any) {
    throw new Error(`Error checking balance: ${error.message}`);
  }
};

async function main() {
  try {
    checkBalance("BuhYQ3jTMJh1hJMdtc8A3JPJrDrSARamJTA4ZrwHPjdW"); //shaq.sol
    checkBalance("FX1APjKbFu6M8GKb3dGXcZLXjxX4fGaYwvHqb5Vaee8q"); //toly.sol
    checkBalance("ArzAcfaki8CZnUgAaELQoBZWs2DsqgPaBoZHjLXAoYy9"); //mccann.sol
  } catch (error) {
    console.error(error);
  }
}
main();
