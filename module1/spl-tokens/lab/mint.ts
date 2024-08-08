import { getExplorerLink } from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";

export const mintToken = async () => {
  try {
    const DECIMAL = 2;
    const MINT_AMOUNT = 100;

    const user = loadKeypairFromEnvironment();

    console.log(
      `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
    );
    const tokenMintAccount = new PublicKey(
      "HDJZ3fG2jz5wYnsjXBGro843FMg2Yjy3GQrfgwiAGJzF"
    );

    const recipientATA = new PublicKey(
      "UQGS5iFC3AnLTvMMvwGUnR2pat4vAixyeupK9hWAPLi"
    );

    const transactionSignature = await mintTo(
      connection,
      user,
      tokenMintAccount,
      recipientATA,
      user,
      MINT_AMOUNT * Math.pow(10, DECIMAL),
      [],
      { commitment: "confirmed" }
    );

    const link = getExplorerLink("transaction", transactionSignature, "devnet");

    console.log(`✅ Success! Mint Token Transaction: ${link}`);
  } catch (error: any) {
    throw new Error(`Error minting token: ${error.message}`);
  }
};
