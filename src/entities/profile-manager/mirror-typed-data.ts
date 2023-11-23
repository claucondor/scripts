import { EIP712TypedDataField } from "./post-typed-data";
import { EIP712TypedDataDomain } from "./post-typed-data";

export interface CreateOnchainMirrorEIP712TypedDataTypes {
  Mirror: EIP712TypedDataField[];
}

export interface CreateOnchainMirrorEIP712TypedDataValue {
  nonce: string;
  deadline: string;
  profileId: string;
  metadataURI: string;
  pointedProfileId: string;
  pointedPubId: string;
  referrerProfileIds: string[];
  referrerPubIds: string[];
  referenceModuleData: string;
}

export interface CreateOnchainMirrorEIP712TypedData {
  types: Record<string, EIP712TypedDataField[]>;
  domain: EIP712TypedDataDomain;
  value: CreateOnchainMirrorEIP712TypedDataValue;
}

export interface CreateOnchainMirrorBroadcastItemResult {
  id: string;
  expiresAt: string;
  typedData: CreateOnchainMirrorEIP712TypedData;
}
