export const CREATE_ON_CHAIN_POST_TYPED_DATA = `
mutation createOnchainPostTypedData(
    $options: TypedDataOptions,
    $request: OnchainPostRequest!
  ) {
    createOnchainPostTypedData(
      options: $options,
      request: $request
    ) {
      id
      expiresAt
      typedData {
        types {
          Post {
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
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }`;
