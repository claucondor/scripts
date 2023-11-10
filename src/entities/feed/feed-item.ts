import { PrimaryPublication, Mirror } from "./any-publication";
import { ReactionEvent } from "./reaction-event";
import { Comment } from "./any-publication";

export interface FeedItem {
  id: string;
  root: PrimaryPublication;
  mirrors: Mirror[];
  reactions: ReactionEvent[];
  comments: Comment[];
}
