export const CHALLENGE_QUERY = `
  query Challenge($signedBy: String, $for: String) {
    challenge(request: { signedBy: $signedBy, for: $for }) {
      text
    }
  }
`;
