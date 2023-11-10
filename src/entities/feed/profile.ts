import { NetworkAddress } from "./network-address";

interface Profile {
  id: string;
  ownedBy: NetworkAddress;
  txHash: string;
  createdAt: string;
  stats: ProfileStats;
  request: ProfileStatsArg;
  operations: ProfileOperations;
  interests: string[];
  guardian: ProfileGuardianResult | null;
  invitedBy: Profile | null;
  invitesLeft: number;
  onchainIdentity: ProfileOnchainIdentity;
  followNftAddress: NetworkAddress | null;
  metadata: ProfileMetadata | null;
  getProfileMetadataArgs: GetProfileMetadataArgs;
  followModule: FollowModule | null;
  handle: HandleInfo | null;
  signless: boolean;
  sponsor: boolean;
}

