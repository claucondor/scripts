export const CREATE_CHANGE_PROFILE_MANAGER_TYPED_DATA = `
mutation createChangeProfileManagersTypedData(
    $options: TypedDataOptions,
    $request: ChangeProfileManagersRequest!
  ) {
    createChangeProfileManagersTypedData(
      options: $options,
      request: $request
    ) {
      id
      expiresAt
      typedData {
        types {
          ChangeDelegatedExecutorsConfig {
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
          delegatorProfileId
          delegatedExecutors
          approvals
          configNumber
          switchToGivenConfig
        }
      }
    }
  }
`;
