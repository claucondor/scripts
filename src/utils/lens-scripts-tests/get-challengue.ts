async function getChallenge(client: GraphQLClient, signedBy: string, forProfile: string): Promise<string> {
  try {
    const response = await client.request(CHALLENGE_QUERY, {
      signedBy,
      for: forProfile,
    });

    return response.challenge.text;
  } catch (error) {
    throw new Error(`Error while getting challenge: ${error.message}`);
  }
}