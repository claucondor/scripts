import { connectToBigQuery, connectToFirestore } from "./src/infrastructure";
import { MigrationRepository } from "./src/repositories/migration";
import { MigrationUseCase } from "./src/usecases/migration";
import { OldWav3s } from "./src/entities/oldWav3s";
import { NewWav3 } from "./src/entities/newWav3s";
import { mapOldWav3sToNewWav3s } from "./src/usecases/utils";

const oldProyect = "quant-cripto-fund";
const prodProyect = "zurf-social";
const stagingProyect = "zurf-social-staging";

const oldFirestoreDb = connectToFirestore(oldProyect);

const stagingFirestoreDb = connectToFirestore(stagingProyect);
const prodFirestoreDb = connectToFirestore(prodProyect);

const stagingBigQueryDb = connectToBigQuery(stagingProyect);
const prodProyectBigQueryDb = connectToBigQuery(prodProyect);

const migrationRepository = new MigrationRepository(
  oldFirestoreDb,
  prodFirestoreDb,
  stagingFirestoreDb
);

const migrationUseCase = new MigrationUseCase(migrationRepository);

(async () => {
  try {
    await migrationUseCase.oldWav3sToNewWav3s(false);
  } catch (error) {
    console.log(error);
  }
})();
