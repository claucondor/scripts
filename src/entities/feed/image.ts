import { URI } from "./profile-metadata";

export type MimeType = string;

interface Image {
  mimeType: MimeType;
  width: number;
  height: number;
  uri: URI;
}
