import { createAssociateTokenAccount } from "./create-associated-token-account";
import { createMetadata } from "./create-token-metadata";
import { createTokenMint } from "./create-token-mint";
import { mintToken } from "./mint";
import { transferToken } from "./transfer";

async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      console.log(
        "Please provide an argument: 'create-mint', 'metadata', 'ata', 'mint-token', or 'transfer'"
      );
      return;
    }

    const command = args[0].toLowerCase();

    if (command === "create-mint") {
      await createTokenMint(); // Run createTokenMint() if 'mint' is passed
    } else if (command === "metadata") {
      await createMetadata(); // Run createMetadata() if 'metadata' is passed
    } else if (command === "ata") {
      await createAssociateTokenAccount(); // Run createAssociateTokenAccount() if 'ata' is passed
    } else if (command === "mint-token") {
      await mintToken(); // Run mintToken() if 'mint-token' is passed
    } else if (command === "transfer") {
      await transferToken(); // Run transferToken() if 'transfer' is passed
    } else {
      console.log(
        "Invalid argument. Please use 'create-mint', 'metadata', 'ata', 'mint-token', or 'transfer'"
      );
    }
  } catch (error) {
    console.error(error);
  }
}

main();


// collection address:7UeQt4SavvYgG2hxFB8AqPVu1kT7rK24PoWj6A8CB7BZ