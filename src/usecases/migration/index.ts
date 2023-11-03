import { IMigrationUseCase } from "./interface";
import { IMigrationRepository } from "../../repositories/migration/interface";

import { mapOldWav3sToNewWav3s } from "../utils";

import { GetProfileByFiltersDto } from "../../entities/migration/dto/get-profile-by-filters-dto";
import { PaymentDto } from "../../entities/migration/dto/payment-dto";
import { Profile } from "../../entities/profile";
import { Timestamp } from "@google-cloud/firestore";
import { NewPaymentDto } from "../../entities/migration/dto/new-payments-dto";

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
    let oldWav3s = await this.migrationRepository.getOldWav3s("wav3s-mainnet");
    const actualPayments: PaymentDto[] =
      await this.migrationRepository.getAllPayments(env);
    console.log(`fetch ${actualPayments.length} payments`);
    for (const oldWav3 of oldWav3s) {
      for (const address of oldWav3.mirroedAndDeposited) {
        const matchingPaymentIndex = actualPayments.findIndex(
          (payment) =>
            payment.pubId === oldWav3.publicationId &&
            payment.wallet === address
        );

        if (matchingPaymentIndex !== -1) {
          oldWav3.mirroedAndDeposited.splice(matchingPaymentIndex, 1);

          if (oldWav3.mirroedAndDeposited.length === 0) {
            const oldWav3Index = oldWav3s.findIndex(
              (wav3) => wav3.publicationId === oldWav3.publicationId
            );
            oldWav3s.splice(oldWav3Index, 1);
          }
        }
      }
    }

    const profilesMap = new Map<string, Profile>();
    let i = 1;
    let payments: PaymentDto[] = [];

    for (const oldWav3 of oldWav3s) {
      console.log(`${i} . create Payments for ${oldWav3.publicationId}`);
      const deposits = oldWav3.mirroedAndDeposited;
      if (deposits && deposits.length > 0) {
        for (const deposit of deposits) {
          if (deposit === "0x" || deposit === "0x0") {
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
      i++;
      if (i >= 5) {
        i = 0;
        console.log(`inserting payments...`);

        await this.migrationRepository.createPayments(env, payments);
        payments = [];
      }
    }
  }

  async paymentsZurfers(env: boolean): Promise<void> {
    const oldPayments = await this.migrationRepository.getAllOldPayments();

    const oldWav3s = await this.migrationRepository.getOldWav3s(
      "wav3s-mainnet"
    );

    console.log(`fetch ${oldPayments.length} old payments`);

    const paymentPromises = oldPayments.map(async (oldPayment) => {
      const payment: NewPaymentDto = {
        publication_id: oldPayment.publicationId || "",
        action: oldPayment.actionEvent || "",
        hash: oldPayment.hash,
        handle: oldPayment.handle || "",
        address: oldPayment.address || "",
        paid_at: oldPayment.date || new Timestamp(0, 0),
        reward: oldPayment.reward || 0,
        currency: oldPayment.currency || "",
        gas_paid: oldPayment.gasPaid || 0,
        distribution_type: "fcfs",
        rewarded_by: "",
        social_graph: "Lens",
      };
      const matchingWav3 = oldWav3s.find(
        (wav3) => wav3.publicationId === oldPayment.publicationId
      );
      if (matchingWav3) {
        payment.rewarded_by = matchingWav3.handle || "";
      }

      return payment;
    });

    const payments = await Promise.all(paymentPromises);
    console.log(`Mapped ${payments.length} old payments to Payment objects`);
    await this.migrationRepository.insertNewPayments(env, payments);
  }
}
