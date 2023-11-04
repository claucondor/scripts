import { GraphQLClient } from "graphql-request";
import { CHALLENGE_QUERY } from "./querys";

export async function getChallenge(
  client: GraphQLClient,
  signedBy: string,
  forProfile: string
): Promise<any> {
  try {
    const response = (await client.request(CHALLENGE_QUERY, {
      signedBy,
      for: forProfile,
    })) as any;

    return response.challenge;
  } catch (error: any) {
    throw new Error(`Error while getting challenge: ${error.message}`);
  }
}
