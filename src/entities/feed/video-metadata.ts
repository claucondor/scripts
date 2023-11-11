import { PublicationContentWarningType } from "./text-only-metadata-v3";
import { MarketplaceMetadata } from "./marketplace-metadata";
import { MetadataAttribute } from "./text-only-metadata-v3";
import { Image } from "./image";

export interface VideoMetadataV3 {
  __typename: string;
  id: string;
  rawURI: string;
  locale: string;
  tags: string[];
  contentWarning: PublicationContentWarningType;
  hideFromFeed: boolean;
  appId: string;
  marketplace: MarketplaceMetadata;
  attributes: MetadataAttribute[];
  asset: PublicationMetadataMediaVideo;
  attachments: (
    | PublicationMetadataMediaVideo
    | PublicationMetadataMediaImage
    | PublicationMetadataMediaAudio
  )[];
  isShortVideo: boolean;
  title: string;
  content: string;
}

export interface Audio {
  mimeType: string;
  uri: string;
}

export interface EncryptableAudio {
  mimeType: string;
  uri: string;
}

export interface EncryptableAudioSet {
  raw: EncryptableAudio;
  optimized: Audio;
}

export interface PublicationMetadataMediaAudio {
  audio: EncryptableAudioSet;
  attributes: MetadataAttribute[];
  cover: EncryptableImageSet;
  duration: number;
  license: PublicationMetadataLicenseType;
  credits: string;
  artist: string;
  genre: string;
  recordLabel: string;
  lyrics: string;
}

export interface PublicationMetadataMediaImage {
  image: EncryptableImageSet;
  license: PublicationMetadataLicenseType;
  altTag: string;
  atributes: MetadataAttribute[];
}

export interface PublicationMetadataMediaVideo {
  video: EncryptableVideoSet;
  cover: EncryptableImageSet;
  duration: number;
  license: PublicationMetadataLicenseType;
  altTag: string;
  attributes: MetadataAttribute[];
}

export interface EncryptableVideoSet {
  raw: EncryptableVideo;
  optimized?: Video;
}

export interface EncryptableVideo {
  mimeType: string;
  uri: string;
}

export interface EncryptableImageSet {
  raw: EncryptableImage;
  optimized?: Image;
}

export interface EncryptableImage {
  mimeType: string;
  width: number;
  height: number;
  uri: string;
}

export interface Video {
  mimeType: string;
  uri: string;
}

export enum PublicationMetadataLicenseType {
  CCO = "CCO",
  CC_BY = "CC_BY",
  CC_BY_ND = "CC_BY_ND",
  CC_BY_NC = "CC_BY_NC",
  TBNL_C_D_PL_Legal = "TBNL_C_D_PL_Legal",
  TBNL_C_DT_PL_Legal = "TBNL_C_DT_PL_Legal",
  TBNL_C_ND_PL_Legal = "TBNL_C_ND_PL_Legal",
  TBNL_C_D_NPL_Legal = "TBNL_C_D_NPL_Legal",
  TBNL_C_DT_NPL_Legal = "TBNL_C_DT_NPL_Legal",
  TBNL_C_DTSA_PL_Legal = "TBNL_C_DTSA_PL_Legal",
  TBNL_C_DTSA_NPL_Legal = "TBNL_C_DTSA_NPL_Legal",
  TBNL_C_ND_NPL_Legal = "TBNL_C_ND_NPL_Legal",
  TBNL_C_D_PL_Ledger = "TBNL_C_D_PL_Ledger",
  TBNL_C_DT_PL_Ledger = "TBNL_C_DT_PL_Ledger",
  TBNL_C_ND_PL_Ledger = "TBNL_C_ND_PL_Ledger",
  TBNL_C_D_NPL_Ledger = "TBNL_C_D_NPL_Ledger",
  TBNL_C_DT_NPL_Ledger = "TBNL_C_DT_NPL_Ledger",
  TBNL_C_DTSA_PL_Ledger = "TBNL_C_DTSA_PL_Ledger",
  TBNL_C_DTSA_NPL_Ledger = "TBNL_C_DTSA_NPL_Ledger",
  TBNL_C_ND_NPL_Ledger = "TBNL_C_ND_NPL_Ledger",
  TBNL_NC_D_PL_Legal = "TBNL_NC_D_PL_Legal",
  TBNL_NC_DT_PL_Legal = "TBNL_NC_DT_PL_Legal",
  TBNL_NC_ND_PL_Legal = "TBNL_NC_ND_PL_Legal",
  TBNL_NC_D_NPL_Legal = "TBNL_NC_D_NPL_Legal",
  TBNL_NC_DT_NPL_Legal = "TBNL_NC_DT_NPL_Legal",
  TBNL_NC_DTSA_PL_Legal = "TBNL_NC_DTSA_PL_Legal",
  TBNL_NC_DTSA_NPL_Legal = "TBNL_NC_DTSA_NPL_Legal",
  TBNL_NC_ND_NPL_Legal = "TBNL_NC_ND_NPL_Legal",
  TBNL_NC_D_PL_Ledger = "TBNL_NC_D_PL_Ledger",
  TBNL_NC_DT_PL_Ledger = "TBNL_NC_DT_PL_Ledger",
  TBNL_NC_ND_PL_Ledger = "TBNL_NC_ND_PL_Ledger",
  TBNL_NC_D_NPL_Ledger = "TBNL_NC_D_NPL_Ledger",
  TBNL_NC_DT_NPL_Ledger = "TBNL_NC_DT_NPL_Ledger",
  TBNL_NC_DTSA_PL_Ledger = "TBNL_NC_DTSA_PL_Ledger",
  TBNL_NC_DTSA_NPL_Ledger = "TBNL_NC_DTSA_NPL_Ledger",
  TBNL_NC_ND_NPL_Ledger = "TBNL_NC_ND_NPL_Ledger",
}
