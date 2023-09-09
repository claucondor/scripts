import { IMigrationRepository } from "./interface";

class MigrationRepository implements IMigrationRepository {
  oldFirestoreDb: any;
  newFirestoreDb: any;

  constructor(oldFirestoreDb: any, newFirestoreDb: any) {
    this.oldFirestoreDb = oldFirestoreDb;
    this.newFirestoreDb = newFirestoreDb;
  }
  migrateWav3s(): Promise<void> {
    return Promise.resolve();
  }
}
