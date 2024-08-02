import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import {
  getExplorerLink
} from "@solana-developers/helpers";
import {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction
} from "@solana/web3.js";
import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";

export const createMetadata = async () => {
  try {
    const user = loadKeypairFromEnvironment();

    console.log(
      `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
    );

    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    const tokenMintAccount = new PublicKey(
      "HDJZ3fG2jz5wYnsjXBGro843FMg2Yjy3GQrfgwiAGJzF"
    );

    const metadata = {
      name: "I am Groot",
      symbol: "GROOT",
      uri: "https://raw.githubusercontent.com/zain335/ipfs/main/groot/groot.png",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };

    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMintAccount.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const metadataPDA = metadataPDAAndBump[0];

    const transaction = new Transaction();
    const createMetadataAccountInstruction =
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPDA,
          mint: tokenMintAccount,
          mintAuthority: user.publicKey,
          payer: user.publicKey,
          updateAuthority: user.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            collectionDetails: null,
            data: metadata,
            isMutable: true,
          },
        }
      );

    transaction.add(createMetadataAccountInstruction);

    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [user]
    );

    const transactionLink = getExplorerLink(
      "transaction",
      transactionSignature,
      "devnet"
    );

    console.log(
      `✅ Transaction confirmed, explorer link is: ${transactionLink}!`
    );

    const tokenMintLink = getExplorerLink(
      "address",
      tokenMintAccount.toString(),
      "devnet"
    );

    console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);
  } catch (error: any) {
    throw new Error(`Error creating token mint: ${error.message}`);
  }
};
