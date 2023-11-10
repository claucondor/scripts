export interface ProfileMetadata {
  displayName?: string;
  bio?: Markdown;
  rawURI?: URI;
  appId?: AppId;
  attributes?: MetadataAttribute[];
  picture?: ProfilePicture;
  coverPicture?: ImageSet;
}

export type Markdown = string;
export type URI = string;
export type AppId = string;
export type MetadataAttributeType =
  | "BOOLEAN"
  | "DATE"
  | "NUMBER"
  | "STRING"
  | "JSON";

export interface MetadataAttribute {
  type: MetadataAttributeType;
  key: string;
  value: string;
}
