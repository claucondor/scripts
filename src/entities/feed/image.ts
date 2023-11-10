import { URI } from "./profile-metadata";

export type MimeType = string;

export interface Image {
  mimeType: MimeType;
  width: number;
  height: number;
  uri: URI;
}
