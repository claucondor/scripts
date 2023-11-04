export const AUTHENTICATE_MUTATION = `
  mutation Authenticate($id: ChallengeId!, $signature: Signature!) {
    authenticate(request: { id: $id, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;
