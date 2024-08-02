import { getExplorerLink } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";

export const createAssociateTokenAccount = async () => {
  try {
    const user = loadKeypairFromEnvironment();

    console.log(
      `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
    );

    const tokenMintAccount = new PublicKey(
      "HDJZ3fG2jz5wYnsjXBGro843FMg2Yjy3GQrfgwiAGJzF"
    );

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      tokenMintAccount,
      user.publicKey
    );

    console.log(`Associated Token Account: ${tokenAccount.address.toBase58()}`);

    const link = getExplorerLink(
      "address",
      tokenAccount.address.toBase58(),
      "devnet"
    );

    console.log(`✅ Created associated token Account: ${link}`);
  } catch (error: any) {
    throw new Error(
      `Error creating associated token account: ${error.message}`
    );
  }
};
