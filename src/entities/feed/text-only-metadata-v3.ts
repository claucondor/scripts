import { MarketplaceMetadata } from "./marketplace-metadata";
import { URI } from "./profile-metadata";
import { AppId } from "./profile-metadata";

export interface TextOnlyMetadataV3 {
  id: string;
  rawURI: URI;
  locale: string;
  tags: string[];
  contentWarning?: PublicationContentWarningType;
  hideFromFeed: boolean;
  appId?: AppId;
  marketplace?: MarketplaceMetadata;
  attributes?: MetadataAttribute[];
  content: string;
}

export type PublicationContentWarningType =
  | "NSFW"
  | "Sensitive"
  | "Spoiler"
  | null;

export interface MetadataAttribute {
  type: MetadataAttributeType;
  key: string;
  value: string;
}

export type MetadataAttributeType =
  | "BOOLEAN"
  | "DATE"
  | "NUMBER"
  | "STRING"
  | "JSON";
