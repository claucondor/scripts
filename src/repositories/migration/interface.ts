import { OldWav3s } from "../../entities/oldWav3s";
import { NewWav3 } from "../../entities/newWav3s";

export interface IMigrationRepository {
  getOldWav3s(collection: string): Promise<OldWav3s[]>;
  createNewWav3s(env: boolean, wav3s: NewWav3[]): Promise<void>;
}
