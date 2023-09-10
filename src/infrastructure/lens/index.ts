import { GraphQLClient } from "graphql-request";
import { LENS_API_URL } from "../env";

export function createLensClient(): GraphQLClient {
  return new GraphQLClient(LENS_API_URL as string);
}
