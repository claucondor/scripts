import { Timestamp } from "@google-cloud/firestore";

type specialConditions = {
  appFilter?: string;
  erc20GatedAddress?: string;
  onlyFollowers?: boolean;
  poap1?: any;
  poap2?: any;
  poap3?: any;
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
  ownedBy: string;
  specialConditions?: specialConditions;
  status: string;
};

export { specialConditions, OldWav3s };
