import { TokenId } from "./profile-picture";
import { NetworkAddress } from "./network-address";

export interface HandleInfo {
  id: TokenId;
  fullHandle: Handle;
  namespace: string;
  localName: string;
  suggestedFormatted: SuggestedFormattedHandle;
  linkedTo: HandleLinkedTo | null;
  ownedBy: string;
}

export type Handle = string;

export interface SuggestedFormattedHandle {
  full: string;
  localName: string;
}

export interface HandleLinkedTo {
  contract: NetworkAddress;
  nftTokenId: TokenId;
}
