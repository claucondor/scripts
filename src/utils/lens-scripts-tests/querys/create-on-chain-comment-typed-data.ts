export const CREATE_ON_CHAIN_COMMENT_TYPED_DATA = `
mutation createOnchainCommentTypedData(
    $options: TypedDataOptions,
    $request: OnchainCommentRequest!
  ) {
    createOnchainCommentTypedData(
      options: $options,
      request: $request
    ) {
      id
      expiresAt
      typedData {
        types {
          Comment {
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
