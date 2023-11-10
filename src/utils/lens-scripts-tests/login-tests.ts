import { GraphQLClient } from "graphql-request";
import { Wallet, utils } from "ethers";
import { getChallenge } from "./get-challengue";
import { authenticateWithChallenge } from "./authenticate-with-challenge";
import {
  PROFILE_ADRESS,
  PROFILE_ID,
  WALLET_PK,
} from "../../infrastructure/env";
import { PUBLICATIONS_QUERY } from "./querys/publications-query";
import { FEED_QUERY } from "./querys/feed-query";
import { FeedItem } from "../../entities/feed/feed-item";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);

async function authenticateUser() {
  const signedBy = PROFILE_ADRESS;
  const forProfile = PROFILE_ID;

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

    const response = (await client.request(FEED_QUERY, {
      request: {
        cursor: null,
        where: {
          feedEventItemTypes: ["POST"], // Tipo de evento (puedes especificar otros)
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
          //for: "ProfileId", /* valor de ProfileId opcional */
        },
      },
    })) as any;
    const itemFeed = response.result.items[0] as FeedItem;
    console.log(itemFeed.id);
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
