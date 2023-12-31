import { OptimisticStatusResult } from "./optimistic-status-result";
import { TriStateValue } from "./tri-state-value";

export interface ProfileOperations {
    id: string;
    isBlockedByMe: OptimisticStatusResult;
    hasBlockedMe: OptimisticStatusResult;
    isFollowedByMe: OptimisticStatusResult;
    isFollowingMe: OptimisticStatusResult;
    canBlock: boolean;
    canUnblock: boolean;
    canFollow: TriStateValue;
    canUnfollow: boolean;
  }