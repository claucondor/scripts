import { Timestamp } from "@google-cloud/firestore";

type specialConditions = {
  appFilter?: string;
  erc20GatedAddress?: string;
  onlyFollowers?: boolean;
  poap1?: any;
  poap2?: any;
  poap3?: any;
};

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
  mirrorFrom?: mirroredFrom[];
  ownedBy: string;
  specialConditions?: specialConditions;
  status: string;
};

export { specialConditions, OldWav3s, mirroredFrom };
