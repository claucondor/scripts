export interface NetworkAddress {
  address: EvmAddress;
  chainId: ChainId;
}

type EvmAddress = string;
type ChainId = string;
