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
    console.error(`Error adding keypair to .env file: ${error.message}`);
  }
};

const loadKeypairFromEnvironment = async () => {
  try {
    const secretKeyString = process.env.SECRET_KEY;
    if (!secretKeyString) {
      throw new Error(`Invalid SECRET_KEY`);
    }

    let secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const keypair = Keypair.fromSecretKey(secretKey);

    console.log(`We've loaded our secret key securely, using an env file!`);
    console.log(
      `Public Key of loaded secret key: ${keypair.publicKey.toBase58()}`
    );
    console.log(`✅ Finished!`);
  } catch (error: any) {
    console.error(`Error loading keypair from environment: ${error.message}`);
  }
};

function main() {
  // Uncomment to generate and save a new keypair
  generateNewKeypair();

  // Uncomment to load keypair from environment
  // loadKeypairFromEnvironment();
}

main();
