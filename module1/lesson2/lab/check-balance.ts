import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";

const checkBalance = async () => {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Invalid SECRET_KEY.");
    const keypair = loadKeypairFromEnvironment();

    const publicKey = keypair.publicKey;

    const connection = new Connection(clusterApiUrl("devnet"));

    const balanceInLamports = await connection.getBalance(publicKey);

    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

    console.log(
      `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
    );
  } catch (error: any) {
    console.error(`Error: Checking Balance ${error.message}`);
  }
};

async function main() {
  checkBalance();
}
main();
