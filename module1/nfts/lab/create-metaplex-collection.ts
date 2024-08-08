import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getKeypairFromFile,
  airdropIfRequired,
} from "@solana-developers/helpers";
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { readFileSync } from "fs";
import { loadKeypairFromEnvironment } from "../../lesson1/lab/generate-keypair";
import { connection } from "../../utils";
import { Data, Metadata } from "@metaplex-foundation/mpl-token-metadata";

export const createCollection = async () => {
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

  const collectionNftData = {
    name: "WeAreGroot",
    symbol: "Groot",
    description: "Groot Collection",
    sellerFeeBasisPoints: 111,
    imageFile: "groot.png",
    isCollection: true,
    collectionAuthority: user,
  };

  // Load file into Metaplex
  const buffer = readFileSync(collectionNftData.imageFile);
  const file = toMetaplexFile(buffer, collectionNftData.imageFile);

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const uploadMetadataOutput = await metaplex.nfts().uploadMetadata({
    name: collectionNftData.name,
    symbol: collectionNftData.symbol,
    description: collectionNftData.description,
    image: imageUri,
  });

  const collectionUri = uploadMetadataOutput.uri;
  console.log("Collection offchain metadata URI:", collectionUri);

  // create a collection NFT using the URI from the metadata
  const createNftOutput = await metaplex.nfts().create(
    {
      uri: collectionUri,
      name: collectionNftData.name,
      sellerFeeBasisPoints: collectionNftData.sellerFeeBasisPoints,
      symbol: collectionNftData.symbol,
      isCollection: true,
    },
    { commitment: "finalized" }
  );

  const collectionNft = createNftOutput.nft;

  console.log(
    `Collection NFT: https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`
  );

  console.log(`Collection NFT address is`, collectionNft.address.toString());

  console.log("✅ Finished successfully!");
};
