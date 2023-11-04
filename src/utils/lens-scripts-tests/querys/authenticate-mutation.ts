export const AUTHENTICATE_MUTATION = `
  mutation Authenticate($id: String, $signature: String) {
    authenticate(request: { id: $id, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;