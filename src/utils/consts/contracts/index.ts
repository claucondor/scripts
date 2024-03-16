import { WAV3S_POLYGON_CONTRACT_ADDRESS } from "./addresses/wav3s";
import WAV3S_POLYGON_CONTRACT_ABI from "./abi/wav3s-v2-abi.json";

import { KAMALEONT_CONTRACT_ADDRESSES } from "./addresses/kamaleont";
import KAMALEONT_CONTRACT_ABI from "./abi/kamaleont-abi.json";

import { LENS_CONTRACT_ADDRESS } from "./addresses/lens";
import LENS_CONTRACT_ABI from "./abi/lens.json";

import { NEW_KAMALEONT_CONTRACT_ADDRESSES } from "./addresses/kamaleont";
import KAMALEONT_NEW_ABI from "./abi/kamaleon-new-abi.json";

type Contracts = {
  WAV3S_POLYGON_CONTRACT_ADDRESS: string;
  WAV3S_POLYGON_CONTRACT_ABI: any;
  //
  LENS_CONTRACT_ADDRESS: string;
  LENS_CONTRACT_ABI: any;
  //
  KAMALEONT_CONTRACT_ADDRESSES: string;
  KAMALEONT_CONTRACT_ABI: any;
  // 
  NEW_KAMALEONT_CONTRACT_ADDRESSES: string;
  KAMALEONT_NEW_ABI: any;
};

const contracts: Contracts = {
  WAV3S_POLYGON_CONTRACT_ADDRESS,
  WAV3S_POLYGON_CONTRACT_ABI,
  //
  LENS_CONTRACT_ADDRESS,
  LENS_CONTRACT_ABI,
  //
  KAMALEONT_CONTRACT_ADDRESSES,
  KAMALEONT_CONTRACT_ABI,
  //
  NEW_KAMALEONT_CONTRACT_ADDRESSES,
  KAMALEONT_NEW_ABI,

};

export { contracts };
