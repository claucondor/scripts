import { OldWav3s } from "../../entities/oldWav3s";
import { NewWav3 } from "../../entities/newWav3s";

export function mapOldWav3sToNewWav3s(oldWav3s: OldWav3s[]): NewWav3[] {
  return oldWav3s.map((oldWav3) => ({
    id: "",
    externalId: oldWav3.publicationId,
    action: "mirror",
    socialGraph: "Lens",
    distribution: {
      type: "fcfs",
    },
    status: oldWav3?.status || "legacy",
    totalReward: oldWav3.goalOfMirrors * oldWav3.reward,
    rewardPerZurfer: oldWav3.reward,
    currency: "WMATIC",
    minimumFollowersAction: oldWav3?.minimumFollowersMirror || 1,
    goalOfAction: oldWav3.goalOfMirrors,
    ownedBy: oldWav3.ownedBy,
    handle: oldWav3.handle,
    contractVersion: parseInt(oldWav3.contractVersion),
    specialConditions: oldWav3?.specialConditions || {},
    createdAt: oldWav3.date,
  }));
}
