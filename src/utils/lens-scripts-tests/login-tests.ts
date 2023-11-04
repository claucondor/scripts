import { GraphQLClient } from "graphql-request";
import { Wallet, utils } from "ethers";
import { getChallenge } from "./get-challengue";
import { authenticateWithChallenge } from "./authenticate-with-challenge";
import {
  PROFILE_ADRESS,
  PROFILE_ID,
  WALLET_PK,
} from "../../infrastructure/env";

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
    console.log("Challenge text:", challengeData);

    const wallet = new Wallet(WALLET_PK as string); // Reemplaza con tu clave privada real
    const signature = await wallet.signMessage(challengeData.text);

    const tokens = await authenticateWithChallenge(
      client,
      challengeData.id,
      signature
    );
    console.log("Access Token:", tokens.accessToken);
    console.log("Refresh Token:", tokens.refreshToken);
  } catch (error) {
    console.error(error);
  }
}

// Llama a la función de autenticación
authenticateUser();
