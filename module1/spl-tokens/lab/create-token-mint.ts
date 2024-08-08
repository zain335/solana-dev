import {
  getExplorerLink
} from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";

export const createTokenMint = async () => {
  try {
    const user = loadKeypairFromEnvironment();

    console.log(
      `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
    );

    const tokenMint = await createMint(
      connection,
      user,
      user.publicKey,
      null,
      2
    );

    const link = getExplorerLink("address", tokenMint.toString(), "devnet");

    console.log(`✅ Finished! Created token mint: ${link}`);
  } catch (error: any) {
    throw new Error(`Error creating token mint: ${error.message}`);
  }
};
