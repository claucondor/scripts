import { FeedItem } from "./feed-item";

export interface PaginatedFeed {
  items: FeedItem[];
  pageInfo: PaginatedResultInfo;
}

export interface PaginatedResultInfo {
  prev: Cursor;
  next: Cursor;
}

type Cursor = string;
