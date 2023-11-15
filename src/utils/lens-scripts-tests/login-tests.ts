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
              address: "0xC38f33A75b58093ba1c21C4B2763f48DaB226ff2",
              action: "ADD",
            },
          ],
        },
      }
    )) as any;
    console.log(response);

    const test: CreateChangeProfileManagersBroadcastItemResult = response;
    console.log(test)
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
