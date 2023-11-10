import { NetworkAddress } from "./network-address";
import { ProfileStats } from "./profile-stats";
import { ProfileOperations } from "./profile-operations";
import { ProfileGuardianResult } from "./profile-guardian-result";
import { ProfileOnchainIdentity } from "./profile-on-chain-identity";
import { ProfileMetadata } from "./profile-metadata";

interface Profile {
  id: string;
  ownedBy: NetworkAddress;
  txHash: string;
  createdAt: string;
  stats: ProfileStats;
  operations: ProfileOperations;
  interests: string[];
  guardian: ProfileGuardianResult | null;
  invitedBy: Profile | null;
  invitesLeft: number;
  onchainIdentity: ProfileOnchainIdentity;
  followNftAddress: NetworkAddress | null;
  metadata: ProfileMetadata | null;
  handle: HandleInfo | null;
  signless: boolean;
  sponsor: boolean;
}
