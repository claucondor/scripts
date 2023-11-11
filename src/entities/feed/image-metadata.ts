import { URI } from "./profile-metadata";
import { PublicationContentWarningType } from "./text-only-metadata-v3";
import { AppId } from "./profile-metadata";
import { MarketplaceMetadata } from "./marketplace-metadata";
import { MetadataAttribute } from "./profile-metadata";
import { PublicationMetadataMediaImage } from "./video-metadata";
import { PublicationMetadataMediaVideo } from "./video-metadata";
import { PublicationMetadataMediaAudio } from "./video-metadata";

export interface ImageMetadataV3 {
  __type: string;
  id: string;
  rawURI: URI;
  locale: string;
  tags: string[];
  contentWarning: PublicationContentWarningType;
  hideFromFeed: boolean;
  appId: AppId;
  marketplace: MarketplaceMetadata;
  attributes: MetadataAttribute[];
  asset: PublicationMetadataMediaImage;
  attachments: (
    | PublicationMetadataMediaVideo
    | PublicationMetadataMediaImage
    | PublicationMetadataMediaAudio
  )[];
  title: string;
  content: string;
}
