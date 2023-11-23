import { GraphQLClient } from "graphql-request";
import { Wallet } from "ethers";
import { WALLET_PK, ZURF_SOCIAL_PRIVATE_KEY } from "../../infrastructure/env";
import { CREATE_CHANGE_PROFILE_MANAGER_TYPED_DATA } from "./querys/create-change-profile-manafer-typed-data";
import { CreateChangeProfileManagersBroadcastItemResult } from "../../entities/profile-manager/typed-data";
import { ethers } from "ethers";
import { contracts } from "../consts/contracts";
import { getGasToPay, getSigner } from "../get-signer";
import { BigNumber } from "ethers";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);

export async function delegate(accessToken: string) {
  const lensContractUser = new ethers.Contract(
    contracts.LENS_CONTRACT_ADDRESS,
    contracts.LENS_CONTRACT_ABI,
    getSigner(WALLET_PK as string)
  );
  const lensContractZurf = new ethers.Contract(
    contracts.LENS_CONTRACT_ADDRESS,
    contracts.LENS_CONTRACT_ABI,
    getSigner(ZURF_SOCIAL_PRIVATE_KEY as string)
  );
  try {
    const wallet = new Wallet(WALLET_PK as string);

    client.setHeader("x-access-token", accessToken);

    const response = (await client.request(
      CREATE_CHANGE_PROFILE_MANAGER_TYPED_DATA,
      {
        request: {
          changeManagers: [
            {
              address: "0xC38f33A75b58093ba1c21C4B2763f48DaB226ff2",
              action: "ADD",
            },
          ],
        },
      }
    )) as any;

    console.log(response);

    const {
      createChangeProfileManagersTypedData: test,
    }: {
      createChangeProfileManagersTypedData: CreateChangeProfileManagersBroadcastItemResult;
    } = response;

    console.log(JSON.stringify(test.typedData));

    const domain = test.typedData.domain;
    const types = test.typedData.types;

    const value = test.typedData.value;

    const signatureHex = await wallet._signTypedData(domain, types, value);

    console.log(signatureHex);

    const signatureTyped = ethers.utils.splitSignature(signatureHex);
    const v = signatureTyped.v;
    const r = signatureTyped.r;
    const s = signatureTyped.s;

    console.log("v:", v);
    console.log("r:", r);
    console.log("s:", s);

    const {
      delegatorProfileId,
      delegatedExecutors,
      approvals,
      configNumber,
      switchToGivenConfig,
    } = test.typedData.value;

    const feePerGas = await getGasToPay();

    const transaction =
      await lensContractZurf.changeDelegatedExecutorsConfigWithSig(
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig,
        {
          signer: wallet.address,
          v,
          r,
          s,
          deadline: test.typedData.value.deadline,
        },
        {
          gasLimit: BigNumber.from(1000000),
          maxFeePerGas: feePerGas.max,
          maxPriorityFeePerGas: feePerGas.maxPriority,
        }
      );

    await transaction.wait();
    console.log(transaction);
  } catch (error) {
    console.error(error);
  }
}
