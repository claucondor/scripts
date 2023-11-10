import { Profile } from "./profile";
import { HandleInfo } from "./handle-info";

export interface ProfileMentioned {
  profile: Profile;
  snapshotHandleMentioned: HandleInfo;
  stillOwnsHandle: boolean;
}
