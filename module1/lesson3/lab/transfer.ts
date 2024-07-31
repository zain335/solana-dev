import {
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import "dotenv/config";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection, getBalance } from "../../utils";

const transfer = async (params: { to: string; amount: number }) => {
  try {
    const { to, amount } = params;

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Invalid SECRET_KEY.");
    const keypair = loadKeypairFromEnvironment();

    const publicKey = keypair.publicKey;

    const balanceInSOLBefore = await getBalance(to);
    console.log(`💰 Before Transfer! The balance is ${balanceInSOLBefore}!`);

    const toPubkey = new PublicKey(to);

    const transaction = new Transaction();

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey,
      lamports: amount,
    });

    transaction.add(sendSolInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);

    console.log(`💸 Finished! Sent ${amount} to the address ${toPubkey}. `);
    console.log(`Transaction signature is ${signature}!`);

    const balanceInSOLAfter = await getBalance(to);
    console.log(`💰 After Transfer! The balance is ${balanceInSOLAfter}!`);
  } catch (error: any) {
    throw Error(`Error transferring: ${error.message}`);
  }
};

async function main() {
  try {
    const TO = "4irdM7jP2TqvwqpGoiiSs8AuBfEFx1UQ5ZS3ERawzoxH";
    const LAMPORTS_TO_SEND = 5000;
    await transfer({
      to: TO,
      amount: LAMPORTS_TO_SEND,
    });
  } catch (error) {
    console.error(error);
  }
}
main();
