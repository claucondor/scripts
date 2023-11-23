export const CREATE_ON_CHAIN_MIRROR_TYPED_DATA = `
mutation createOnchainMirrorTypedData(
    $options: TypedDataOptions,
    $request: OnchainMirrorRequest!
  ) {
    createOnchainMirrorTypedData(
      options: $options,
      request: $request
    ) {
      id
      expiresAt
      typedData {
        types {
          Mirror {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          metadataURI
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
        }
      }
    }
  }
  
`;
