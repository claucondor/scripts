import { PrimaryPublication, Mirror,  } from "./any-publication";
import { ReactionEven}
export interface FeedItem {
  id: string;
  root: PrimaryPublication;
  mirrors: Mirror[];
  reactions: ReactionEvent[];
  comments: Comment[];
}
