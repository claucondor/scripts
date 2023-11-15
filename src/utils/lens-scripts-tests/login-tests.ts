import { GraphQLClient } from "graphql-request";
import { Transaction, Wallet, utils } from "ethers";
import { getChallenge } from "./get-challengue";
import { authenticateWithChallenge } from "./authenticate-with-challenge";
import {
  PROFILE_ADRESS,
  PROFILE_ID,
  WALLET_PK,
  ZURF_SOCIAL_PRIVATE_KEY,
} from "../../infrastructure/env";
import { PUBLICATIONS_QUERY } from "./querys/publications-query";
import { FEED_QUERY } from "./querys/feed-query";
import { FeedItem } from "../../entities/feed/feed-item";
import { PaginatedFeed } from "../../entities/feed/paginated-feed";
import { fileExistsAsync } from "tsconfig-paths/lib/filesystem";
import {
  AnyPublication,
  Mirror,
  Post,
  Quote,
} from "../../entities/feed/any-publication";
import { Comment } from "../../entities/feed/any-publication";
import { CREATE_CHANGE_PROFILE_MANAGER_TYPED_DATA } from "./querys/create-change-profile-manafer-typed-data";
import { CreateChangeProfileManagersBroadcastItemResult } from "../../entities/profile-manager/typed-data";
import { WAV3S_POLYGON_CONTRACT_ADDRESS } from "../consts/contracts/addresses/wav3s";
import { ethers } from "ethers";
import { contracts } from "../consts/contracts";
import { getGasToPay, getSigner } from "../get-signer";
import { BigNumber } from "ethers";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);

function isComment(publication: AnyPublication): publication is Comment {
  return (publication as Comment).root !== undefined;
}

function isMirror(publication: AnyPublication): publication is Mirror {
  return (publication as Mirror).mirrorOn !== undefined;
}

function isPost(publication: AnyPublication): publication is Post {
  return (publication as Post).__typename == "Post";
}

function isQuote(publication: AnyPublication): publication is Quote {
  return (publication as Quote).quoteOn !== undefined;
}

async function authenticateUser() {
  const signedBy = PROFILE_ADRESS;
  const forProfile = PROFILE_ID;

  const lensContract = new ethers.Contract(
    contracts.LENS_CONTRACT_ADDRESS,
    contracts.LENS_CONTRACT_ABI,
    getSigner(WALLET_PK as string)
  );

  try {
    console.log("Signed by:", signedBy);
    console.log("For profile:", forProfile);
    const challengeData = await getChallenge(
      client,
      signedBy as string,
      forProfile as string
    );
    console.log("Challenge text:", challengeData.text);

    const wallet = new Wallet(WALLET_PK as string);
    const signature = await wallet.signMessage(challengeData.text);

    const tokens = await authenticateWithChallenge(
      client,
      challengeData.id,
      signature
    );

    console.log("Access Token:", tokens.accessToken);
    console.log("Refresh Token:", tokens.refreshToken);

    client.setHeader("x-access-token", tokens.accessToken);

    const response = (await client.request(
      CREATE_CHANGE_PROFILE_MANAGER_TYPED_DATA,
      {
        request: {
          changeManagers: [
            {
              address: WAV3S_POLYGON_CONTRACT_ADDRESS,
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
      nonce,
      deadline,
    } = test.typedData.value;
    const feePerGas = await getGasToPay();

    const transaction =
      await lensContract.changeDelegatedExecutorsConfigWithSig(
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
          deadline,
        },
        {
          gasLimit: BigNumber.from(1000000),
          maxFeePerGas: feePerGas.max,
          maxPriorityFeePerGas: feePerGas.maxPriority,
        }
      );

    await transaction.wait();
    console.log(transaction)
    /* Feed
    const response = (await client.request(FEED_QUERY, {
      request: {
        cursor: null,
        where: {
          //feedEventItemTypes: ["POST"], // Tipo de evento (puedes especificar otros)
          //metadata: {
          //  locale: "zh-cmn-Hans-CN", // Locale opcional
          //  contentWarning: {
          //    oneOf: ["NSFW"] // Filtro de advertencia de contenido opcional
          //  },
          //  mainContentFocus: ["VIDEO"], // Enfoque de contenido principal (puedes especificar otros)
          //  tags: {
          //    oneOf: ["xyz789"], // Tags opcionales
          //    all: ["xyz789"] // Otra forma de especificar tags opcionales
          //  },
          //  publishedOn: ["AppId"] // AppId opcional (puedes especificar otros)
          //},
          //for: "ProfileId", /* valor de ProfileId opcional 
        },
      },
    })) as any;
    const Feed = response.result as PaginatedFeed;
    Feed.items.map((item: FeedItem) => {
      if (isPost(item.root) && item.mirrors.length > 0) {
        console.log(item.root.metadata);
      }
    });
    */
    //console.log(Feed.pageInfo.next);
    /* Publications
    const response = (await client.request(PUBLICATIONS_QUERY, {
      request: {
        limit: "Ten",
        where: {
          publicationIds: ["0xab1a-0x0260-DA-2e48212e", "0x012d4e-0x01f5"],
        },
      },
    })) as any;
    (response.result.items as any[]).map((item) => {
      console.log(item.id);
    });
    */
    /* Profiles
    const response = (await client.request(PROFILES_QUERY, {
      request: {
        limit: "Ten",
        where: {
          //ownedBy: ["0x0DD3aA0d06C0DDD99e0184AC31E5ca7fB4E5e342"],
          profileIds: ["0x05"],
          //          handles: ["lens"],
          //          whoQuotedPublication: "PublicationId",
          //          whoMirroredPublication: "PublicationId",
          //          whoCommentedOn: "PublicationId"
        },
      },
    })) as any;
    (response.result.items as any[]).map((item) => {
      console.log(item.metadata);
    });
    */
  } catch (error) {
    console.error(error);
  }
}

// Llama a la función de autenticación
authenticateUser();
