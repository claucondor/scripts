import { ImageSet } from "./profile-picture";
import { URI } from "./profile-metadata";

export interface MarketplaceMetadata {
  description?: string;
  externalURL?: string;
  name: string;
  attributes?: PublicationMarketplaceMetadataAttribute[];
  image: ImageSet;
  animationUrl?: URI;
}

export interface PublicationMarketplaceMetadataAttribute {
  displayType: MarketplaceMetadataAttributeDisplayType;
  traitType: string;
  value: string;
}

export type MarketplaceMetadataAttributeDisplayType =
  | "NUMBER"
  | "STRING"
  | "DATE";
