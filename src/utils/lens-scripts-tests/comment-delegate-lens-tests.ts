import { GraphQLClient } from "graphql-request";
import { ZURF_SOCIAL_PRIVATE_KEY } from "../../infrastructure/env";

import { ethers } from "ethers";
import { contracts } from "../consts/contracts";
import { getGasToPay, getSigner } from "../get-signer";
import { BigNumber } from "ethers";
import { CREATE_ON_CHAIN_POST_TYPED_DATA } from "./querys/create-on-chain-post-typed-data";
import { CreateOnchainPostBroadcastItemResult } from "../../entities/profile-manager/post-typed-data";
import { CREATE_ON_CHAIN_COMMENT_TYPED_DATA } from "./querys/create-on-chain-comment-typed-data";
import { CreateOnchainCommentBroadcastItemResult } from "../../entities/profile-manager/comment-typed-data";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);

export async function delegatedComment(
  accessToken: string,
  metadataTx: string,
  pubIdToComment: string
) {
  const lensContractZurf = new ethers.Contract(
    contracts.LENS_CONTRACT_ADDRESS,
    contracts.LENS_CONTRACT_ABI,
    getSigner(ZURF_SOCIAL_PRIVATE_KEY as string)
  );

  try {
    client.setHeader("x-access-token", accessToken);

    const response = (await client.request(CREATE_ON_CHAIN_COMMENT_TYPED_DATA, {
      //options: {
      //  overrideSigNonce: "TU_VALOR_DE_NONCE",
      //},
      request: {
        contentURI: `https://arweave.net/${metadataTx}`,
        commentOn: pubIdToComment,
        // commentOnReferenceModuleData: {
        // data
        //   },
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
                 address: "0x0000000",
                 data: "Blockchain data?"
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
          referrers: [
          {
            publicationId: "",
            profileId: "",
          },
          {
            publicationId: "",
            profileId: "",
          },
            // se agregan mas
          ],
    */
      },
    })) as any;

    const {
      createOnchainCommentTypedData: test,
    }: {
      createOnchainCommentTypedData: CreateOnchainCommentBroadcastItemResult;
    } = response;
    console.log(JSON.stringify(test));

    const {
      profileId,
      contentURI,
      pointedProfileId,
      pointedPubId,
      referrerProfileIds,
      referrerPubIds,
      referenceModuleData,
      actionModules,
      actionModulesInitDatas,
      referenceModule,
      referenceModuleInitData,
    } = test.typedData.value;

    const commentParams = {
      profileId,
      contentURI,
      pointedProfileId,
      pointedPubId,
      referrerProfileIds,
      referrerPubIds,
      referenceModuleData,
      actionModules,
      actionModulesInitDatas,
      referenceModule,
      referenceModuleInitData,
    };

    const feePerGas = await getGasToPay();

    const transaction = await lensContractZurf.comment(commentParams, {
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
