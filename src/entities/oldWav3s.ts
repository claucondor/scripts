import { Timestamp } from "@google-cloud/firestore";

type mirroredFrom = {
  appId: string;
  date: Timestamp;
  profileId: string;
};
type OldWav3s = {
  publicationId: string;
  reward: number;
  socialGraph: string;
  contractVersion: string;
  date: Timestamp;
  goalOfMirrors: number;
  handle: string;
  minimumFollowersMirror: number;
  mirroedAndDeposited: string[];
  mirroredFrom?: mirroredFrom[];
  ownedBy: string;
  specialConditions?: any;
  status: string;
};

export { OldWav3s, mirroredFrom };
