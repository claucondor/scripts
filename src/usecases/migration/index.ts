import { IMigrationUseCase } from "./interface";
import { IMigrationRepository } from "../../repositories/migration/interface";

import { mapOldWav3sToNewWav3s } from "../utils";

import { GetProfileByFiltersDto } from "../../entities/migration/dto/get-profile-by-filters-dto";
import { PaymentDto } from "../../entities/migration/dto/payment-dto";
import { Profile } from "../../entities/profile";

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
    const payments: PaymentDto[] = [];
    const profilesMap = new Map<string, Profile>(); // Objeto Map para almacenar los perfiles

    for (const oldWav3 of oldWav3s) {
      console.log(`create Payments for ${oldWav3.publicationId}`);
      const deposits = oldWav3.mirroedAndDeposited;
      if (deposits && deposits.length > 0) {
        for (const deposit of deposits) {
          if (deposit === "0x") {
            continue;
          }
          console.log(`Address: ${deposit}`);
          if (profilesMap.has(deposit)) {
            console.log(`Already Found profile for ${deposit}`);
            const profile = profilesMap.get(deposit);
            if (profile) {
              payments.push({
                pubId: oldWav3.publicationId,
                handle: profile.handle || "",
                wallet: deposit,
                date: oldWav3.date,
                amount: oldWav3.reward,
                payed_by: oldWav3.handle,
                action: "mirror",
                distribution: "fcfs",
                profileId: profile.externalId || "",
              });
            }
          } else {
            const profileFilter: GetProfileByFiltersDto = {
              address: deposit,
            };
            console.log(`Getting profile for ${deposit}`);

            const profile = await this.migrationRepository.getProfile(
              profileFilter
            );
            if (profile?.externalId) {
              console.log(`Found profile for ${deposit}`);
              profilesMap.set(deposit, profile);
              console.log(`Add Payment for ${deposit}`);
              payments.push({
                pubId: oldWav3.publicationId,
                handle: profile.handle || "",
                wallet: deposit,
                date: oldWav3.date,
                amount: oldWav3.reward,
                payed_by: oldWav3.handle,
                action: "mirror",
                distribution: "fcfs",
                profileId: profile.externalId || "",
              });
            }
          }
        }
      }
    }

    await this.migrationRepository.createPayments(env, payments);
  }
}
