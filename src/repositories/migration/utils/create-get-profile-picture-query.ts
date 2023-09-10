import { GqlQueryBuilder } from "../../../utils/gql-query-builder";
const PROFILE_ITEMS = `
{
  name
  picture {
    ... on MediaSet {
      original {
        url
      }
    }
  }
  handle
}
`;

function createGetProfilePictureQuery(handles: string[]): any {
  const gqlQueryBuilder = new GqlQueryBuilder("profiles");

  const gqlQuery = gqlQueryBuilder
    .addInitialQuery()
    .addRequest()
    .addRequestParam("handles", handles)
    .addRequestParam("limit", handles.length)
    .closeKey()
    .closeParenthesis()
    .addItems(PROFILE_ITEMS)
    .addPageInfo()
    .closeKey()
    .closeKey()
    .build();

  return gqlQuery;
}

export { createGetProfilePictureQuery };
