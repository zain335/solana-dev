import {
  Metaplex,
  irysStorage,
  keypairIdentity,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import {
  PublicKey
} from "@solana/web3.js";
import { readFileSync } from "fs";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";

export const createNFT = async () => {
  // initialize a keypair for the user
  const user = loadKeypairFromEnvironment();

  console.log("Loaded user:", user.publicKey.toBase58());

  // metaplex set up
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      irysStorage({
        address: "https://devnet.irys.xyz",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  // Substitute in your collection NFT address from create-metaplex-nft-collection.ts
  const collectionNftAddress = new PublicKey(
    "7UeQt4SavvYgG2hxFB8AqPVu1kT7rK24PoWj6A8CB7BZ"
  );

  // example data for a new NFT
  const nftData = {
    name: "Groot",
    symbol: "GROOT",
    description: "I am Groot",
    sellerFeeBasisPoints: 222,
    imageFile: "groot.png",
  };

  // Load the file into Metaplex
  const buffer = readFileSync(nftData.imageFile);
  const file = toMetaplexFile(buffer, nftData.imageFile);

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const uploadMetadataOutput = await metaplex.nfts().uploadMetadata({
    name: nftData.name,
    symbol: nftData.symbol,
    description: nftData.description,
    image: imageUri,
  });

  const metadataUri = uploadMetadataOutput.uri;

  const createNftOutput = await metaplex.nfts().create(
    {
      uri: metadataUri, // metadata URI
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
      symbol: nftData.symbol,
      collection: collectionNftAddress,
    },
    { commitment: "finalized" }
  );
  const nft = createNftOutput.nft;

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  await metaplex.nfts().verifyCollection({
    // Verify our collection as a Certified Collection
    // See https://developers.metaplex.com/token-metadata/collections
    mintAddress: nft.mint.address,
    collectionMintAddress: collectionNftAddress,
    isSizedCollection: true,
  });

  console.log(`Created NFT address is`, nft.address.toString());

  console.log("✅ Finished successfully!");
};
