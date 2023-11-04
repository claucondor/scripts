import { GraphQLClient } from "graphql-request";
import { AUTHENTICATE_MUTATION } from "./querys";

export async function authenticateWithChallenge(
  client: GraphQLClient,
  challengeId: string,
  signature: string
): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const response = (await client.request(AUTHENTICATE_MUTATION, {
      id: challengeId,
      signature,
    })) as any;

    return response.authenticate;
  } catch (error: any) {
    throw new Error(`Error while authenticating: ${error.message}`);
  }
}
