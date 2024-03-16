export const CREATE_ON_CHAIN_MOMOKA_MIRROR_TYPED_DATA = `
mutation CreateMomokaMirrorTypedData($request: MomokaMirrorRequest!) {
    createMomokaMirrorTypedData(request: $request) {
      expiresAt
      typedData {
        value {
          deadline
          metadataURI
          nonce
          pointedProfileId
          pointedPubId
          profileId
          referenceModuleData
          referrerProfileIds
          referrerPubIds
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          Mirror {
            name
            type
          }
        }
      }
      id
    }
  }
`;
