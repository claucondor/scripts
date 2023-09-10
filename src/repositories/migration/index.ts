import { IMigrationRepository } from "./interface";
import { OldWav3s } from "../../entities/migration/oldWav3s";
import { NewWav3 } from "../../entities/migration/newWav3s";
import { PaymentDto } from "../../entities/migration/dto/payment-dto";
import { BigQuery } from "@google-cloud/bigquery";
import { GraphQLClient } from "graphql-request";
import { Profile } from "../../entities/profile";
import { GetProfileByFiltersDto } from "../../entities/migration/dto/get-profile-by-filters-dto";
import { createGetProfileQuery } from "./utils/create-get-profiles-by-handle-query";
import { buildExternalProfile } from "./utils/build-external-profile";
import { Timestamp } from "@google-cloud/firestore";

const ZURF = "zurf";
const PAYMENTS = "payments";
export class MigrationRepository implements IMigrationRepository {
  oldFirestoreDb: any;
  prodNewFirestoreDb: any;
  stagingNewFirestoreDb: any;

  prodBigqueryDb: BigQuery;
  stagingBigqueryDb: BigQuery;

  lensApi: GraphQLClient;

  constructor(
    oldFirestoreDb: any,
    prodNewFirestoreDb: any,
    stagingNewFirestoreDb: any,
    prodBigqueryDb: BigQuery,
    stagingBigqueryDb: BigQuery,
    lensApi: GraphQLClient
  ) {
    this.oldFirestoreDb = oldFirestoreDb;
    this.prodNewFirestoreDb = prodNewFirestoreDb;
    this.stagingNewFirestoreDb = stagingNewFirestoreDb;
    this.prodBigqueryDb = prodBigqueryDb;
    this.stagingBigqueryDb = stagingBigqueryDb;
    this.lensApi = lensApi;
  }

  async getOldWav3s(collection: string): Promise<OldWav3s[]> {
    const oldWav3sSnapshot = await this.oldFirestoreDb
      .collection(collection)
      .get();
    const oldWav3s: OldWav3s[] = [];
    oldWav3sSnapshot.forEach((doc: any) => {
      const data = doc.data();
      const mirroredFrom = data.mirroredFrom
        ? data.mirroredFrom.map((item: any) => {
            const appId = item.appId || "";
            const date = item.date?.toDate() || new Date("2022-01-01");
            const profileId = item.profileId || "";

            return {
              appId,
              date,
              profileId,
            };
          })
        : undefined;

      const mirroedAndDeposited = data.mirroredAndDeposited || [];

      const mirroredAndDeposited: string[] = Array.isArray(mirroedAndDeposited)
        ? mirroedAndDeposited
        : Object.values(mirroedAndDeposited);

      const oldWav3: OldWav3s = {
        publicationId: data.publicationId,
        reward: data.reward,
        socialGraph: "Lens",
        contractVersion: data.contractVersion?.toString() || "0",
        date: data.date?.toDate() || new Date("2022-01-01"),
        goalOfMirrors: data.goalOfMirrors,
        handle: data.handle,
        minimumFollowersMirror: data.minimumFollowersMirror,
        mirroedAndDeposited: mirroredAndDeposited,
        mirroredFrom: mirroredFrom,
        ownedBy: data.ownedBy,
        specialConditions: data.specialConditions,
        status: data.status,
      };

      oldWav3s.push(oldWav3);
    });

    return oldWav3s;
  }

  async createNewWav3s(env: boolean, wav3s: NewWav3[]): Promise<void> {
    const collection = "wav3s";
    let totalDocuments = 0;
    for (const newWav3 of wav3s) {
      console.log(newWav3);
      let docRef;
      if (newWav3.goalOfAction) {
        if (env) {
          docRef = await this.prodNewFirestoreDb.collection(collection).doc();
        } else {
          docRef = await this.stagingNewFirestoreDb
            .collection(collection)
            .doc();
        }
        newWav3.id = docRef.id;

        await docRef.set(newWav3);
        totalDocuments++;
      }
    }
    console.log(`Total documents: ${totalDocuments}`);
  }

  async createPayments(env: boolean, payments: PaymentDto[]): Promise<void> {
    const PROJECT_ID = env ? "zurf-social" : "zurf-social-staging";
    const batchSize = 10;

    // Conjunto para rastrear las combinaciones únicas de pubId y wallet
    const uniqueCombinations = new Set<string>();

    const insertPaymentBatch = async (batch: PaymentDto[]) => {
      const query = `
        INSERT INTO \`${PROJECT_ID}.${ZURF}.${PAYMENTS}\` (pubId, handle, wallet, date, amount, payed_by, action, distribution, profileId)
        VALUES 
      `;
      const values = batch.map((payment) => {
        const combination = `${payment.pubId}-${payment.wallet}`;

        if (uniqueCombinations.has(combination)) {
          console.log(
            `Payment with pubId ${payment.pubId} and wallet ${payment.wallet} already exists, skipping.`
          );
          return null;
        }

        uniqueCombinations.add(combination);

        const date = new Date(String(payment.date));

        return `('${payment.pubId}', '${payment.handle}', '${
          payment.wallet
        }', '${date.toISOString()}', ${payment.amount}, '${
          payment.payed_by
        }', '${payment.action}', '${payment.distribution}', '${
          payment.profileId
        }')`;
      });

      const insertQuery =
        query + values.filter((value) => value !== null).join(", ");

      env
        ? await this.prodBigqueryDb.query(insertQuery)
        : await this.stagingBigqueryDb.query(insertQuery);
    };

    for (let i = 0; i < payments.length; i += batchSize) {
      const remainingPayments = payments.length - i;
      const batch = payments.slice(
        i,
        i + Math.min(batchSize, remainingPayments)
      );
      await insertPaymentBatch(batch);
      console.log(`Inserted ${batch.length} payments`);
    }
  }

  async getProfile(
    filters: GetProfileByFiltersDto
  ): Promise<Profile | undefined> {
    try {
      console.log("aqui getProfile");
      const query = createGetProfileQuery(filters);

      const response: any = await this.lensApi.request(query);

      if ("profile" in response) {
        return buildExternalProfile(response.profile);
      } else if ("profiles" in response && filters.address) {
        const { items } = response.profiles;

        if (items.length === 0) {
          return undefined;
        }

        let defaultProfile = items.find(
          (profile: Profile) => profile.isDefault === true
        );

        if (!defaultProfile) {
          defaultProfile = items[0];
        }
        console.log("construyendo profile");
        return buildExternalProfile(defaultProfile);
      }
      return undefined;
    } catch (err: any) {
      console.log(err);
      return undefined;
    }
  }
}
