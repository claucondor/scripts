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
import { PROFILES_QUERY } from "./querys/profiles-query";

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
  } catch (error) {
    console.error(error);
  }
}

// Llama a la función de autenticación
authenticateUser();
