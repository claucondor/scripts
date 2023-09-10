import { getProfilesByHandlesItems } from "../const";
import { GetProfileByFiltersDto } from "../../../entities/migration/dto/get-profile-by-filters-dto";
import { GqlQueryBuilder } from "../../../utils/gql-query-builder";

interface QueryBuilderStrategy {
  buildQuery: (
    gqlQueryBuilder: GqlQueryBuilder,
    key: string,
    value: string
  ) => string;
}

class HandleOrProfileIdStrategy implements QueryBuilderStrategy {
  buildQuery(
    gqlQueryBuilder: GqlQueryBuilder,
    key: string,
    value: string
  ): string {
    return gqlQueryBuilder
      .addInitialQuery()
      .addRequest()
      .addRequestParam(key, value)
      .closeKey()
      .closeParenthesis()
      .addItem(getProfilesByHandlesItems)
      .closeKey()
      .build();
  }
}

class AddressStrategy implements QueryBuilderStrategy {
  buildQuery(
    gqlQueryBuilder: GqlQueryBuilder,
    key: string,
    value: string
  ): string {
    const query = `query Profiles {
      profiles(request: { ownedBy: ["${value}"], limit: 10 }) {
        items {
          id
          name
          bio
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          isDefault
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          handle
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          ownedBy
          dispatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  symbol
                  name
                  decimals
                  address
                }
                value
              }
              recipient
            }
            ... on ProfileFollowModuleSettings {
             type
            }
            ... on RevertFollowModuleSettings {
             type
            }
          }
        }
        pageInfo {
          prev
          next
          totalCount
        }
      }
    }`;

    return query;
  }
}

export function createGetProfileQuery(filters: GetProfileByFiltersDto): string {
  const { handle, profileId, address } = filters;
  let strategy: QueryBuilderStrategy;
  let key: string;
  let value: string;

  if (handle || profileId) {
    strategy = new HandleOrProfileIdStrategy();
    key = handle ? "handle" : "profileId";
    value = handle || profileId || "";
  } else if (address) {
    strategy = new AddressStrategy();
    key = "address";
    value = address;
  } else {
    throw new Error("No valid filter provided");
  }

  const gqlQueryBuilder = new GqlQueryBuilder("profile");
  return strategy.buildQuery(gqlQueryBuilder, key, value);
}
