import { App } from "./app";
import { MomokaInfo } from "./momoka-info";
import { Profile } from "./profile";
import { PublicationStats } from "./publication-stats";
import { PublicationOperations } from "./publication-operations";

export interface AnyPublication {
  __typename: string;
  id: string;
  publishedOn: App;
  isHidden: boolean;
  momoka: MomokaInfo;
  txHash: string;
  createdAt: string;
  by: Profile;
  stats: PublicationStats;
  operations: PublicationOperations;
  metadata: any;
  isEncrypted: boolean;
  profilesMentioned: ProfileMentioned[];
  hashtagsMentioned: string[];
}

export interface Post extends AnyPublication {}

export interface Comment extends AnyPublication {
  root: CommentablePublication;
  commentOn: PrimaryPublication;
  firstComment: Comment;
}

export interface Mirror extends AnyPublication {
  mirrorOn: MirrorablePublication;
}

export interface Quote extends AnyPublication {
  quoteOn: PrimaryPublication;
}

export type MirrorablePublication = Post | Comment | Mirror | Quote;
