import { GraphQLClient } from "graphql-request";
import { Wallet } from "ethers";
import { WALLET_PK, ZURF_SOCIAL_PRIVATE_KEY } from "../../infrastructure/env";

import { ethers } from "ethers";
import { contracts } from "../consts/contracts";
import { getGasToPay, getSigner } from "../get-signer";
import { BigNumber } from "ethers";
import { CREATE_ON_CHAIN_POST_TYPED_DATA } from "./querys/create-on-chain-post-typed-data";
import { CreateOnchainPostBroadcastItemResult } from "../../entities/profile-manager/post-typed-data";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);

export async function delegatedPost(accessToken: string, metadataTx: string) {
  const lensContractZurf = new ethers.Contract(
    contracts.LENS_CONTRACT_ADDRESS,
    contracts.LENS_CONTRACT_ABI,
    getSigner(ZURF_SOCIAL_PRIVATE_KEY as string)
  );

  try {
    const zurfWallet = new Wallet(ZURF_SOCIAL_PRIVATE_KEY as string);

    client.setHeader("x-access-token", accessToken);

    const response = (await client.request(CREATE_ON_CHAIN_POST_TYPED_DATA, {
      //options: {
      //  overrideSigNonce: "TU_VALOR_DE_NONCE",
      //},
      request: {
        contentURI: `https://arweave.net/${metadataTx}`,
        /*
          openActionModules: [
            {
              collectOpenAction: {
                multirecipientCollectOpenAction: {
                  amount: "",
                  collectLimit: "",
                  referralFee: VALOR,
                  followerOnly: bool,
                  endsAt: "fecha",
                  recipients: [
                    {
                      // tal vez las address de los que van a recibir?
                    },
                  ],
                },
                simpleCollectOpenAction: {
                  amount: "",
                  referralFee: ??,
                  recipient: "la fee",
                  collectLimit: "limit de los que puedes coleccionar?",
                  followerOnly: true,
                  endsAt: "hasta cuando?",
                },
              },
              unknownOpenAction: {
                // otras acciones investigar?
              },
              },
            },
          ],
          refedrenceModule: false,
            degreesOfSeparationReferenceModule: {
              commentsRestricted: false,
              mirrorsRestricted: true,
              quotesRestricted: true,
              degreesOfSeparation: 123,
              sourceProfileId: "Id del dueño del post, no zurf",
            },
            unknownReferenceModule: {
              // investigar
            },
          },
          */
      },
    })) as any;

    const {
      createOnchainPostTypedData: test,
    }: {
      createOnchainPostTypedData: CreateOnchainPostBroadcastItemResult;
    } = response;
    console.log(JSON.stringify(test.typedData));
    const domain = test.typedData.domain;
    const types = test.typedData.types;

    const value = test.typedData.value;

    const signatureHex = await zurfWallet._signTypedData(domain, types, value);

    console.log(signatureHex);

    const signatureTyped = ethers.utils.splitSignature(signatureHex);
    const v = signatureTyped.v;
    const r = signatureTyped.r;
    const s = signatureTyped.s;

    console.log("v:", v);
    console.log("r:", r);
    console.log("s:", s);

    const {
      profileId,
      contentURI,
      actionModules,
      actionModulesInitDatas,
      referenceModule,
      referenceModuleInitData,
    } = test.typedData.value;

    const postParams = {
      profileId,
      contentURI,
      actionModules,
      actionModulesInitDatas,
      referenceModule,
      referenceModuleInitData,
    };

    const feePerGas = await getGasToPay();

    const transaction = await lensContractZurf.post(postParams, {
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
