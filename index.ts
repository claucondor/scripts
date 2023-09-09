import { connectToBigQuery, connectToFirestore } from "./src/infrastructure";
import { MigrationRepository } from "./src/repositories/migration";
import { OldWav3s } from "./src/entities/oldWav3s";
import { NewWav3 } from "./src/entities/newWav3s";

const oldProyect = "quant-cripto-fund";
const prodProyect = "zurf-social";
const stagingProyect = "zurf-social-staging";

const oldFirestoreDb = connectToFirestore(oldProyect);

const stagingFirestoreDb = connectToFirestore(stagingProyect);
const prodProyectFirestoreDb = connectToFirestore(prodProyect);

const stagingBigQueryDb = connectToBigQuery(stagingProyect);
const prodProyectBigQueryDb = connectToBigQuery(prodProyect);

const migrationRepository = new MigrationRepository(
  oldFirestoreDb,
  stagingFirestoreDb
);

(async () => {
  try {
    const oldWav3s: OldWav3s[] = await migrationRepository.getOldWav3s(
      "wav3s-mainnet"
    );

    const newWav3s: NewWav3[] = oldWav3s.map((oldWav3) => ({
      id: "",
      externalId: oldWav3.publicationId,
      action: "mirror",
      socialGraph: "Lens",
      distribution: {
        type: "fcfs",
        duration: undefined,
        raffleEndDate: undefined,
      },
      status: oldWav3.status,
      totalReward: undefined,
      rewardPerZurfer: oldWav3.reward,
      currency: "WMATIC",
      minimumFollowersAction: oldWav3.minimumFollowersMirror,
      goalOfAction: oldWav3.goalOfMirrors,
      ownedBy: oldWav3.ownedBy,
      handle: oldWav3.handle,
      contractVersion: parseInt(oldWav3.contractVersion),
      specialConditions: oldWav3.specialConditions,
      createdAt: oldWav3.date,
    }));

    console.log(newWav3s);
  } catch (error) {
    console.log(error);
  }
})();
