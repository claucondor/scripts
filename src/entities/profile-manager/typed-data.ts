interface EIP712TypedDataField {
  name: string;
  type: string;
}

interface EIP712TypedDataDomain {
  name: string;
  chainId: string;
  version: string;
  verifyingContract: string;
}

interface CreateChangeProfileManagersEIP712TypedDataValue {
  nonce: string;
  deadline: string;
  delegatorProfileId: string;
  delegatedExecutors: string[];
  approvals: boolean[];
  configNumber: number;
  switchToGivenConfig: boolean;
}

interface CreateChangeProfileManagersEIP712TypedData {
  types: Record<string, EIP712TypedDataField[]>;
  domain: EIP712TypedDataDomain;
  value: CreateChangeProfileManagersEIP712TypedDataValue;
}

interface CreateChangeProfileManagersEIP712TypedDataTypes {
  ChangeDelegatedExecutorsConfig: EIP712TypedDataField[];
}

export interface CreateChangeProfileManagersBroadcastItemResult {
  id: string;
  expiresAt: string;
  typedData: CreateChangeProfileManagersEIP712TypedData;
}
