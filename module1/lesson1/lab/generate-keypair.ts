import {
  addKeypairToEnvFile,
  keypairToSecretKeyJSON,
} from "@solana-developers/helpers";
import { Keypair } from "@solana/web3.js";
import "dotenv/config";

const generateNewKeypair = async () => {
  const keypair = Keypair.generate();

  console.log(`The public key is: `, keypair.publicKey.toBase58());
  console.log(
    `The secret key is (JSON format): `,
    keypairToSecretKeyJSON(keypair)
  );

  try {
    await addKeypairToEnvFile(keypair, "SECRET_KEY");
    console.log(`✅ Finished!`);
  } catch (error: any) {
    throw new Error(`Error adding keypair to .env file: ${error.message}`);
  }
};

export const loadKeypairFromEnvironment = (params?: { logs?: boolean }) => {
  try {
    const secretKeyString = process.env.SECRET_KEY;
    if (!secretKeyString) {
      throw new Error(`Invalid SECRET_KEY`);
    }

    let secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const keypair = Keypair.fromSecretKey(secretKey);

    if (params?.logs) {
      console.log(`We've loaded our secret key securely, using an env file!`);
      console.log(
        `Public Key of loaded secret key: ${keypair.publicKey.toBase58()}`
      );
      console.log(`✅ Finished!`);
    }
    return keypair;
  } catch (error: any) {
    throw new Error(`Error loading keypair from environment: ${error.message}`);
  }
};

function main() {
  try {
    // Uncomment to generate and save a new keypair
    generateNewKeypair();

    // Uncomment to load keypair from environment
    loadKeypairFromEnvironment({ logs: true });
  } catch (error) {
    console.error(error);
  }
}

// main();
