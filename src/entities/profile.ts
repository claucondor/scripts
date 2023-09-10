import { FollowModuleDto } from "./migration/dto/follow-module-dto";
import { ProfileStatsDto } from "./migration/dto/profile-stats-dto";

export type Profile = {
  externalId: string;
  name?: string;
  bio?: string;
  attributes?: any[];
  isFollowedByMe?: boolean;
  isFollowing?: boolean;
  followNftAddress?: string;
  metadata?: any;
  isDefault?: boolean;
  handle: string;
  picture?: string;
  coverPicture?: string;
  ownedBy: string;
  dispatcher?: {
    address: string;
  };
  profileStats?: ProfileStatsDto;
  followModule?: FollowModuleDto;
  mutualFollowers?: {
    total: number;
    profiles: SimpleProfile[];
  };
};

export type SimpleProfile = {
  externalId: string;
  handle: string;
  picture: string;
};
