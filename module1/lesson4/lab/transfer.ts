import { getExplorerLink } from "@solana-developers/helpers";
import {
  getOrCreateAssociatedTokenAccount,
  transfer
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";

export const transferToken = async () => {
  try {
    const DECIMAL = 2;
    const MINT_AMOUNT = 10;

    const user = loadKeypairFromEnvironment();

    console.log(
      `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
    );
    const tokenMintAccount = new PublicKey(
      "HDJZ3fG2jz5wYnsjXBGro843FMg2Yjy3GQrfgwiAGJzF"
    );

    // Add the recipient public key here.
    const recipient = new PublicKey(
      "4irdM7jP2TqvwqpGoiiSs8AuBfEFx1UQ5ZS3ERawzoxH"
    );

    console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

    // Get or create the source and destination token accounts to store this token
    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      tokenMintAccount,
      user.publicKey
    );

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      tokenMintAccount,
      recipient
    );

    // Transfer the tokens
    const signature = await transfer(
      connection,
      user,
      sourceTokenAccount.address,
      destinationTokenAccount.address,
      user,
      1 * Math.pow(10, DECIMAL)
    );

    const explorerLink = getExplorerLink("transaction", signature, "devnet");

    console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);
  } catch (error: any) {
    throw new Error(`Error transferring token: ${error.message}`);
  }
};
