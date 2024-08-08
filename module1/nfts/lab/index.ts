import { createCollection } from "./create-metaplex-collection";
import { createNFT } from "./create-metaplex-nft";
import { signTransaction } from "./sign-transactin";

async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      console.log(
        "Please provide an argument: 'create-collection', 'create-nft' "
      );
      return;
    }

    const command = args[0].toLowerCase();

    if (command === "create-collection") {
      await createCollection();
    } else if (command === "create-nft") {
      await createNFT();
    } else if (command === "sign-txn") {
      const encodedTxn = args[1];
      const signerKeyEnv = args[2];
      if (!encodedTxn || !signerKeyEnv) {
        console.log("pass <encoded-transaction> <signer-key-env> to command");
        return;
      }
      await signTransaction(encodedTxn, signerKeyEnv);
    } else {
      console.log("Invalid argument. Please use ");
    }
  } catch (error) {
    console.error(error);
  }
}

main();
