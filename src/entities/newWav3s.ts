import { Timestamp } from "@google-cloud/firestore";

type DistributionDto = {
  type: string;
  duration?: number;
  raffleEndDate?: Date;
};

type NewWav3 = {
  id?: string;
  externalId: string;
  action: string;
  socialGraph: string;
  distribution: DistributionDto;
  status: string;
  totalReward?: number;
  rewardPerZurfer: number;
  currency: string;
  minimumFollowersAction: number;
  goalOfAction: number;
  ownedBy: string;
  handle: string;
  contractVersion: number;
  specialConditions: any;
  createdAt?: Timestamp;
};

export { NewWav3, DistributionDto };
