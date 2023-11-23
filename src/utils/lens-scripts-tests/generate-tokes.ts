import { GraphQLClient } from "graphql-request";
import { Wallet } from "ethers";
import { getChallenge } from "./get-challengue";
import { authenticateWithChallenge } from "./authenticate-with-challenge";
import {
  PROFILE_ADRESS,
  PROFILE_ID,
  WALLET_PK,
  ZURF_SOCIAL_PRIVATE_KEY,
} from "../../infrastructure/env";

import { ethers } from "ethers";
import { contracts } from "../consts/contracts";
import { getSigner } from "../get-signer";

const GRAPHQL_API_URL = "https://api-v2.lens.dev/";

const client = new GraphQLClient(GRAPHQL_API_URL);

export async function generateTokens(): Promise<string | undefined> {
  const signedBy = "0xC38f33A75b58093ba1c21C4B2763f48DaB226ff2";
  //const signedBy = PROFILE_ADRESS;
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

    const wallet = new Wallet(ZURF_SOCIAL_PRIVATE_KEY as string);
    //const wallet = new Wallet(WALLET_PK as string);
    const signature = await wallet.signMessage(challengeData.text);

    const tokens = await authenticateWithChallenge(
      client,
      challengeData.id,
      signature
    );

    return tokens.accessToken as string;
  } catch (error) {
    console.error(error);
  }
}
