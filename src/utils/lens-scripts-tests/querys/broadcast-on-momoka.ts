export const BROADCAST_ON_MOMOMKA = `
mutation BroadcastOnMomoka($request: BroadcastRequest!) {
    broadcastOnMomoka(request: $request) {
      ... on CreateMomokaPublicationResult {
        id
        proof
        momokaId
      }
      ... on RelayError {
        reason
      }
    }
  }
`;