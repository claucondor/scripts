import { App } from "./app";
import { MomokaInfo } from "./momoka-info";
import { Profile } from "./profile";

export interface AnyPublication {
  id: string;
  publishedOn: App;
  isHidden: boolean;
  momoka: MomokaInfo;
  txHash: string;
  createdAt: string;
  by: Profile;
  stats: PublicationStats;
  operations: PublicationOperations;
  metadata: PublicationMetadata;
  isEncrypted: boolean;
  openActionModules: OpenActionModule[];
  referenceModule: ReferenceModule;
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
