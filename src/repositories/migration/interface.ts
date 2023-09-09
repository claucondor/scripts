import { OldWav3s } from "../../entities/oldWav3s";

export interface IMigrationRepository {
  getOldWav3s(collection: string): Promise<OldWav3s[]>;
}
