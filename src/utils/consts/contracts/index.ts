import { FCFS_CONTRACT_ADDRESS, RAFFLE_CONTRACT_ADDRESS } from './addresses/wav3s';
import FCFS_CONTRACT_ABI from './abi/fcfs.json';
import RAFFLE_CONTRACT_ABI from './abi/raffle.json';

import { LENS_CONTRACT_ADDRESS } from './addresses/lens';
import LENS_CONTRACT_ABI from './abi/lens.json';

type Contracts = {
  FCFS_CONTRACT_ADDRESS: string;
  FCFS_CONTRACT_ABI: any;
  //
  RAFFLE_CONTRACT_ADDRESS: string;
  RAFFLE_CONTRACT_ABI: any;
  //
  LENS_CONTRACT_ADDRESS: string;
  LENS_CONTRACT_ABI: any;
};

const contracts: Contracts = {
  FCFS_CONTRACT_ADDRESS,
  FCFS_CONTRACT_ABI,
  //
  RAFFLE_CONTRACT_ADDRESS,
  RAFFLE_CONTRACT_ABI,
  //
  LENS_CONTRACT_ADDRESS,
  LENS_CONTRACT_ABI,
};

export { contracts };
