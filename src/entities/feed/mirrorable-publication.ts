import { App } from "./app";
import { MomokaInfo } from "./momoka-info";
import { Profile } from "./profile";
import { PublicationStats } from "./publication-stats";
import { PublicationOperations } from "./publication-operations";
import { PublicationMetadata } from "./publication-metadata";

interface MirrorablePublication {
  id: string;
  publishedOn: App;
  isHidden: boolean;
  momoka: MomokaInfo | null;
  txHash: string;
  createdAt: string;
  by: Profile;
  stats: PublicationStats;
  operations: PublicationOperations;
  metadata: PublicationMetadata;
  isEncrypted: boolean;
}

interface Post extends MirrorablePublication {
  // Campos específicos para un tipo "Post".
  openActionModules?: OpenActionModule[];
  referenceModule?: ReferenceModule;
  profilesMentioned?: ProfileMentioned[];
  hashtagsMentioned?: string[];
}

interface Comment extends MirrorablePublication {
  // Campos específicos para un tipo "Comment".
  root?: CommentablePublication;
  commentOn?: PrimaryPublication;
  firstComment?: Comment;
}

interface Quote extends MirrorablePublication {
  // Campos específicos para un tipo "Quote".
  quoteOn?: PrimaryPublication;
}