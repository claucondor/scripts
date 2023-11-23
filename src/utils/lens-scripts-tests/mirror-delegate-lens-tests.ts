import { GraphQLClient } from "graphql-request";
import { ZURF_SOCIAL_PRIVATE_KEY } from "../../infrastructure/env";

import { ethers } from "ethers";
import { contracts } from "../consts/contracts";
import { getGasToPay, getSigner } from "../get-signer";
import { BigNumber } from "ethers";
import { CREATE_ON_CHAIN_MIRROR_TYPED_DATA } from "./querys/create-on-chain-mirror-typed-data";
import { CreateOnchainMirrorBroadcastItemResult } from "../../entities/profile-manager/mirror-typed-data";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);

export async function delegatedMirror(accessToken: string) {
  const lensContractZurf = new ethers.Contract(
    contracts.LENS_CONTRACT_ADDRESS,
    contracts.LENS_CONTRACT_ABI,
    getSigner(ZURF_SOCIAL_PRIVATE_KEY as string)
  );

  try {
    client.setHeader("x-access-token", accessToken);

    const response = (await client.request(CREATE_ON_CHAIN_MIRROR_TYPED_DATA, {
      //  options: {
      //    overrideSigNonce: "TU_VALOR_DE_NONCE",
      //  },
      request: {
        mirrorOn: "0xe222-0x035f",
        //    metadataURI: "uri de alguna metadata para estadisticas, por ejemplo podemos agregar la app y saber de donde viene el post",
        //    mirrorReferenceModuleData: {
        //    },
        //    referrers: [
        //      {
        //        publicationId: "PUBLICATION_ID",
        //        profileId: "PROFILE_ID",
        //      },
        //
        //    ],
      },
    })) as any;

    const {
      createOnchainMirrorTypedData: test,
    }: {
      createOnchainMirrorTypedData: CreateOnchainMirrorBroadcastItemResult;
    } = response;

    console.log(JSON.stringify(test));
    const {
      profileId,
      metadataURI,
      pointedProfileId,
      pointedPubId,
      referrerProfileIds,
      referrerPubIds,
      referenceModuleData,
    } = test.typedData.value;

    const mirrorParams = {
      profileId,
      metadataURI,
      pointedProfileId,
      pointedPubId,
      referrerProfileIds,
      referrerPubIds,
      referenceModuleData,
    };

    const feePerGas = await getGasToPay();

    const transaction = await lensContractZurf.mirror(mirrorParams, {
      gasLimit: BigNumber.from(1000000),
      maxFeePerGas: feePerGas.max,
      maxPriorityFeePerGas: feePerGas.maxPriority,
    });

    await transaction.wait();
    console.log(transaction);
  } catch (error) {
    console.error(error);
  }
}
