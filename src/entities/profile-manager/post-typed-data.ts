export interface EIP712TypedDataField {
  name: string;
  type: string;
}

export interface EIP712TypedDataDomain {
  name: string;
  chainId: string;
  version: string;
  verifyingContract: string;
}

export interface CreateOnchainPostEIP712TypedDataTypes {
  Post: EIP712TypedDataField[];
}

export interface CreateOnchainPostEIP712TypedDataValue {
  nonce: string;
  deadline: string;
  profileId: string;
  contentURI: string;
  actionModules: string[];
  actionModulesInitDatas: any[];
  referenceModule: string;
  referenceModuleInitData: any;
}

export interface CreateOnchainPostEIP712TypedData {
  types: Record<string, EIP712TypedDataField[]>;
  domain: EIP712TypedDataDomain;
  value: CreateOnchainPostEIP712TypedDataValue;
}

export interface CreateOnchainPostBroadcastItemResult {
  id: string;
  expiresAt: string;
  typedData: CreateOnchainPostEIP712TypedData;
}
