import { Profile } from "./profile";

export interface ReactionEvent {
  by: Profile;
  reaction: PublicationReactionType;
  createdAt: string; 
}

export type PublicationReactionType = "UPVOTE" | "DOWNVOTE";
