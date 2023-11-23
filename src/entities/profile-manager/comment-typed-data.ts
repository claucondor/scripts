import { EIP712TypedDataDomain, EIP712TypedDataField } from "./post-typed-data";

export interface CreateOnchainCommentEIP712TypedDataTypes {
  Comment: EIP712TypedDataField[];
}

export interface CreateOnchainCommentEIP712TypedDataValue {
  nonce: string;
  deadline: string;
  profileId: string;
  contentURI: string;
  pointedProfileId: string;
  pointedPubId: string;
  referrerProfileIds: string[];
  referrerPubIds: string[];
  referenceModuleData: string;
  actionModules: string[];
  actionModulesInitDatas: any[];
  referenceModule: string;
  referenceModuleInitData: string;
}

export interface CreateOnchainCommentEIP712TypedData {
  types: Record<string, EIP712TypedDataField[]>;
  domain: EIP712TypedDataDomain;
  value: CreateOnchainCommentEIP712TypedDataValue;
}

export interface CreateOnchainCommentBroadcastItemResult {
  id: string;
  expiresAt: string;
  typedData: CreateOnchainCommentEIP712TypedData;
}
