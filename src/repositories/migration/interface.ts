export interface IMigrationRepository {
  migrateWav3s(): Promise<void>;
}
