import { IMigrationUseCase } from "./interface";
import { IMigrationRepository } from "../../repositories/migration/interface";

import { mapOldWav3sToNewWav3s } from "../utils";

import { GetProfileByFiltersDto } from "../../entities/migration/dto/get-profile-by-filters-dto";

export class MigrationUseCase implements IMigrationUseCase {
  migrationRepository: IMigrationRepository;

  constructor(migrationRepository: IMigrationRepository) {
    this.migrationRepository = migrationRepository;
  }
  async oldWav3sToNewWav3s(env: boolean): Promise<void> {
    const oldWav3s = await this.migrationRepository.getOldWav3s(
      "wav3s-mainnet"
    );
    let newWav3s = mapOldWav3sToNewWav3s(oldWav3s);

    await this.migrationRepository.createNewWav3s(env, newWav3s);
  }

  async createPaymentsResume(env: boolean): Promise<void> {
    const oldWav3s = await this.migrationRepository.getOldWav3s(
      "wav3s-mainnet"
    );

    for (const oldWav3 of oldWav3s) {
      const deposits = oldWav3.mirroedAndDeposited;
      if (deposits && deposits.length > 0) {
        for (const deposit of deposits) {
          const profileFilter: GetProfileByFiltersDto = {
            address: deposit,
          };
          const profile = await this.migrationRepository.getProfile(
            profileFilter
          );
        }
      }
    }
  }
}
