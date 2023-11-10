export interface PublicationStats {
  id: PublicationId;
  comments: number;
  mirrors: number;
  quotes: number;
  reactions: number;
  countOpenActions: number;
  bookmarks: number;
}

export type PublicationId = string;
