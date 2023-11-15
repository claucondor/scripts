import { WAV3S_POLYGON_CONTRACT_ADDRESS } from "./addresses/wav3s";
import WAV3S_POLYGON_CONTRACT_ABI from "./abi/wav3s-v2-abi.json";

import { LENS_CONTRACT_ADDRESS } from "./addresses/lens";
import LENS_CONTRACT_ABI from "./abi/lens.json";

type Contracts = {
  WAV3S_POLYGON_CONTRACT_ADDRESS: string;
  WAV3S_POLYGON_CONTRACT_ABI: any;
  //
  LENS_CONTRACT_ADDRESS: string;
  LENS_CONTRACT_ABI: any;
};

const contracts: Contracts = {
  WAV3S_POLYGON_CONTRACT_ADDRESS,
  WAV3S_POLYGON_CONTRACT_ABI,
  //
  LENS_CONTRACT_ADDRESS,
  LENS_CONTRACT_ABI,
};

export { contracts };
