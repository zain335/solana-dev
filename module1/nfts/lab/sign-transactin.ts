import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

export const signTransaction = async (
  encodedTransaction: string,
  signerKeyEnv: string
): Promise<any> => {
  try {
    const feePayer = loadKeypairFromEnvironment({ env: signerKeyEnv });
    console.log("Loaded payer: ", feePayer.publicKey.toBase58());

    // Fetch a recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    console.log("Fetched recent blockhash: ", blockhash);

    const recoveredTransaction = getRawTransaction(encodedTransaction);

    if (recoveredTransaction instanceof VersionedTransaction) {
      recoveredTransaction.message.recentBlockhash = blockhash;
      recoveredTransaction.sign([feePayer]);
    } else {
      recoveredTransaction.recentBlockhash = blockhash;
      recoveredTransaction.partialSign(feePayer);
    }

    const txnSignature = await connection.sendRawTransaction(
      recoveredTransaction.serialize()
    );
    console.log(`✅ Transaction Signature: ${txnSignature}`);
    return txnSignature;
  } catch (error) {
    console.log(error);
  }
};

function getRawTransaction(
  encodedTransaction: string
): Transaction | VersionedTransaction {
  let recoveredTransaction: Transaction | VersionedTransaction;
  try {
    recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
  } catch (error) {
    recoveredTransaction = VersionedTransaction.deserialize(
      Buffer.from(encodedTransaction, "base64")
    );
  }
  return recoveredTransaction;
}

// txn signature  = 3JuNF1jmYgGzHHWJH8V7CVuaSwf8nCkBLHkRxuWzgz7Do6QxmncqoRYnQYWfTRRX4nvRZQTzMtessEUdMifqgj5T
