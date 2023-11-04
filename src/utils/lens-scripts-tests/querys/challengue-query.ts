export const CHALLENGE_QUERY = `
query Challenge($signedBy: EvmAddress!, $for: ProfileId) {
    challenge(request: { signedBy: $signedBy, for: $for }) {
      text
      id
    }
  }
`;
