export const CREATE_ON_CHAIN_COMMENT_TYPED_DATA = `
mutation createOnchainQuoteTypedData(
    $options: TypedDataOptions,
    $request: OnchainQuoteRequest!
  ) {
    createOnchainQuoteTypedData(
      options: $options,
      request: $request
    ) {
      id
      expiresAt
      typedData {
        types {
          Quote {
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
          contentURI
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
  
`;
