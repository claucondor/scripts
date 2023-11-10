import { NetworkAddress } from "./network-address";

interface ProfilePicture {
  raw: Image;
  optimized?: Image;
  transformed?: Image;
}

// Definición para ImageSet
interface ImageSet {
  raw: Image;
  optimized?: Image;
  transformed?: Image;
}

// Definición para NftImage
interface NftImage {
  collection: NetworkAddress;
  tokenId: TokenId;
  image: ImageSet;
  verified: boolean;
}

export type TokenId = string;
