import { gql } from 'graphql-request';
import { capitalizeFirstLetter } from '../type_checks';

export class GqlQueryBuilder {
  private resource: string;
  private query: string;
  private emptyParams: boolean;

  constructor(resource: string) {
    this.resource = resource;
    this.query = '';
    this.emptyParams = true;
  }

  addInitialQuery(): GqlQueryBuilder {
    this.query = `
      query ${capitalizeFirstLetter(this.resource)} {
      ${this.resource.toLowerCase()}(`;
    return this;
  }

  addRequest(): GqlQueryBuilder {
    this.query += `
      request: {`;
    return this;
  }

  addRequestParam(key: string, value: any): GqlQueryBuilder {
    const param = `${key}: ${JSON.stringify(value)}`;

    if (this.emptyParams) {
      this.query += `
        ${param}`;
      this.emptyParams = false;
      return this;
    }

    this.query += `,
      ${param}
      `;
    return this;
  }

  addItems(items: string): GqlQueryBuilder {
    this.query += `{
      items ${items}`;
    return this;
  }

  addItem(item: string): GqlQueryBuilder {
    this.query += `
      ${item}`;
    return this;
  }

  addPageInfo(): GqlQueryBuilder {
    this.query += `
      pageInfo {
        prev
        next
        totalCount
      }`;
    return this;
  }

  addFragments(fragments: any): GqlQueryBuilder {
    for (const fragment of Object.values(fragments)) {
      this.query += `
        ${fragment}`;
    }
    return this;
  }

  closeKey(): GqlQueryBuilder {
    this.query += '}';
    return this;
  }

  closeParenthesis(): GqlQueryBuilder {
    this.query += ')';
    return this;
  }

  build(): string {
    return gql`
      ${this.query}
    `;
  }
}
