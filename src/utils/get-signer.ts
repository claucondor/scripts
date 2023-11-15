import { ethers } from "ethers";
import { POLYGON_RPC_URL } from "../infrastructure/env";

export function getSigner(privateKey: string): ethers.Wallet {
  return new ethers.Wallet(
    privateKey,
    new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL)
  );
}
