import { NetworkAddress } from "./network-address";
import { Image } from "./image";

export interface ProfilePicture {
  raw: Image;
  optimized?: Image;
  transformed?: Image;
}

// Definición para ImageSet
export interface ImageSet {
  raw: Image;
  optimized?: Image;
  transformed?: Image;
}

// Definición para NftImage
export interface NftImage {
  collection: NetworkAddress;
  tokenId: TokenId;
  image: ImageSet;
  verified: boolean;
}

export type TokenId = string;
