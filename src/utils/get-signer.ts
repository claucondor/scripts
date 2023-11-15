import { ethers } from "ethers";
import { POLYGON_RPC_URL } from "../infrastructure/env";
import axios from "axios";

type FeePerGas = {
  max: ethers.BigNumber;
  maxPriority: ethers.BigNumber;
};

export function getSigner(privateKey: string): ethers.Wallet {
  return new ethers.Wallet(
    privateKey,
    new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL)
  );
}

export async function getGasToPay(): Promise<FeePerGas> {
  const { data } = await axios({
    method: "GET",
    url: "https://gasstation.polygon.technology/v2",
  });

  const feePerGas: FeePerGas = {
    max: ethers.utils.parseUnits(Math.ceil(data.fast.maxFee) + "", "gwei"),
    maxPriority: ethers.utils.parseUnits(
      Math.ceil(data.fast.maxPriorityFee) + "",
      "gwei"
    ),
  };

  return feePerGas;
}
