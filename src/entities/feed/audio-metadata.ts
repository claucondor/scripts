import { URI } from "./profile-metadata";
import { PublicationContentWarningType } from "./text-only-metadata-v3";
import { AppId } from "./profile-metadata";
import { MarketplaceMetadata } from "./marketplace-metadata";
import { MetadataAttribute } from "./profile-metadata";
import { PublicationMetadataMediaAudio } from "./video-metadata";
import { PublicationMetadataMediaVideo } from "./video-metadata";
import { PublicationMetadataMediaImage } from "./video-metadata";

export interface AudioMetadataV3 {
  id: string;
  rawURI: URI;
  locale: string;
  tags: string[];
  contentWarning: PublicationContentWarningType;
  hideFromFeed: boolean;
  appId: AppId;
  marketplace: MarketplaceMetadata;
  attributes: MetadataAttribute[];
  asset: PublicationMetadataMediaAudio;
  attachments: (
    | PublicationMetadataMediaVideo
    | PublicationMetadataMediaImage
    | PublicationMetadataMediaAudio
  )[];
  title: string;
  content: string;
}
