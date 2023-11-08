import { GraphQLClient } from "graphql-request";
import { Wallet, utils } from "ethers";
import { getChallenge } from "./get-challengue";
import { authenticateWithChallenge } from "./authenticate-with-challenge";
import {
  PROFILE_ADRESS,
  PROFILE_ID,
  WALLET_PK,
} from "../../infrastructure/env";
import { LensClient, production } from "@lens-protocol/client";
import {
  ImageSetFragment,
  ProfileFragment,
} from "@lens-protocol/client/dist/declarations/src";
import { lens } from "../consts/lens";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);
const lensClient = new LensClient({
  environment: production,
});

async function authenticateUser() {
  const signedBy = PROFILE_ADRESS as string;
  const forProfile = PROFILE_ID as string;

  try {
    console.log("Signed by:", signedBy);
    console.log("For profile:", forProfile);

    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy,
      for: forProfile,
    });
    console.log("Challenge text:", text);

    const wallet = new Wallet(WALLET_PK as string);
    const signature = await wallet.signMessage(text);

    await lensClient.authentication.authenticate({
      id,
      signature,
    });

    console.log(
      "Access Token:",
      (await lensClient.authentication.getAccessToken()).unwrap()
    );
    console.log(await lensClient.authentication.fetch());
  } catch (error) {
    console.error(error);
  }
}

// Llama a la función de autenticación
authenticateUser();
