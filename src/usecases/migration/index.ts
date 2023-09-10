import { IMigrationUseCase } from "./interface";
import { IMigrationRepository } from "../../repositories/migration/interface";

import { mapOldWav3sToNewWav3s } from "../utils";

export class MigrationUseCase implements IMigrationUseCase {
  migrationRepository: IMigrationRepository;

  constructor(migrationRepository: IMigrationRepository) {
    this.migrationRepository = migrationRepository;
  }
  async oldWav3sToNewWav3s(env: boolean): Promise<void> {
    if (env) {
      return Promise.resolve();
    } else {
      const oldWav3s = await this.migrationRepository.getOldWav3s(
        "wav3s-mainnet"
      );
      let newWav3s = mapOldWav3sToNewWav3s(oldWav3s);

      await this.migrationRepository.createNewWav3s(env, newWav3s);
    }
  }
}
