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
import { OldPaymentDto } from "../../entities/migration/dto/old-payments-dto";
import { NewPaymentDto } from "../../entities/migration/dto/new-payments-dto";

const ZURF = "zurf";
const PAYMENTS = "payments";
export class MigrationRepository implements IMigrationRepository {
  oldFirestoreDb: any;
  oldBigqueryDb: any;

  prodNewFirestoreDb: any;
  stagingNewFirestoreDb: any;

  prodBigqueryDb: BigQuery;
  stagingBigqueryDb: BigQuery;

  lensApi: GraphQLClient;

  constructor(
    oldFirestoreDb: any,
    oldBigqueryDb: any,
    prodNewFirestoreDb: any,
    stagingNewFirestoreDb: any,
    prodBigqueryDb: BigQuery,
    stagingBigqueryDb: BigQuery,
    lensApi: GraphQLClient
  ) {
    this.oldFirestoreDb = oldFirestoreDb;
    this.oldBigqueryDb = oldBigqueryDb;
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
        // Comprobar si ya existe una wav3s con esa id antes de migrar
        const existingWav3 = await this.findExistingWav3(
          newWav3.externalId || ""
        );
        console.log;
        if (existingWav3) {
          console.log(
            `Wav3s with id ${newWav3.id} already exists. Skipping migration...`
          );
          continue;
        }

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

  async findExistingWav3(externalId: string): Promise<NewWav3 | null> {
    const collection = "wav3s";
    const querySnapshot = await this.prodNewFirestoreDb
      .collection(collection)
      .where("externalId", "==", externalId)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    const existingWav3 = querySnapshot.docs[0].data() as NewWav3;
    return existingWav3;
  }

  async createPayments(env: boolean, payments: PaymentDto[]): Promise<void> {
    const PROJECT_ID = env ? "zurf-social" : "zurf-social-staging";
    const batchSize = 100;

    const insertPaymentBatch = async (batch: PaymentDto[]) => {
      const query = `
        INSERT INTO \`${PROJECT_ID}.${ZURF}.${PAYMENTS}\` (pubId, handle, wallet, date, amount, payed_by, action, distribution, profileId)
        VALUES 
      `;

      const values = [];

      for (const payment of batch) {
        const existsQuery = `
          SELECT COUNT(*) as count
          FROM \`${PROJECT_ID}.${ZURF}.${PAYMENTS}\`
          WHERE pubId = '${payment.pubId}' AND wallet = '${payment.wallet}'
        `;

        const [existsRows] = await (env
          ? this.prodBigqueryDb.query(existsQuery)
          : this.stagingBigqueryDb.query(existsQuery));

        const exists = existsRows[0].count > 0;

        if (!exists) {
          const date = new Date(String(payment.date));

          values.push(
            `('${payment.pubId}', '${payment.handle}', '${
              payment.wallet
            }', '${date.toISOString()}', ${payment.amount}, '${
              payment.payed_by
            }', '${payment.action}', '${payment.distribution}', '${
              payment.profileId
            }')`
          );
        } else {
          console.log(
            `Payment with pubId ${payment.pubId} and wallet ${payment.wallet} already exists, skipping.`
          );
        }
      }

      if (values.length > 0) {
        const insertQuery = query + values.join(", ");

        env
          ? await this.prodBigqueryDb.query(insertQuery)
          : await this.stagingBigqueryDb.query(insertQuery);
      }
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

  async getAllPayments(env: boolean): Promise<PaymentDto[]> {
    const PROJECT_ID = env ? "zurf-social" : "zurf-social-staging";
    const query = `
      SELECT pubId, handle, wallet, date, amount, payed_by, action, distribution, profileId
      FROM \`${PROJECT_ID}.${ZURF}.${PAYMENTS}\`
    `;

    const [rows] = await (env
      ? this.prodBigqueryDb.query(query)
      : this.stagingBigqueryDb.query(query));

    const payments: PaymentDto[] = rows.map((row: any) => ({
      pubId: row.pubId,
      handle: row.handle,
      wallet: row.wallet,
      date: row.date,
      amount: row.amount,
      payed_by: row.payed_by,
      action: row.action,
      distribution: row.distribution,
      profileId: row.profileId,
    }));

    return payments;
  }

  async getAllOldPayments(): Promise<OldPaymentDto[]> {
    const PROJECT_ID = "quant-cripto-fund";

    const query = `
      SELECT
        publication_id,
        action_event,
        \`hash\`,
        handle,
        address,
        date,
        reward,
        currency,
        gas_paid
      FROM
        \`${PROJECT_ID}.${ZURF}.payments_zurfers\`
    `;
    const [rows] = await this.oldBigqueryDb.query(query);

    const payments: OldPaymentDto[] = rows.map((row: any) => {
      const date = new Date(row.date.value);
      return {
        publicationId: row.publication_id,
        actionEvent: row.action_event,
        hash: row.hash,
        handle: row.handle,
        address: row.address,
        date: Timestamp.fromDate(date),
        reward: row.reward,
        currency: row.currency,
        gasPaid: row.gas_paid,
      };
    });

    return payments;
  }

  async insertNewPayments(env: boolean, newPayments: NewPaymentDto[]) {
    const PROJECT_ID = env ? "zurf-social" : "zurf-social-staging";

    for (const payment of newPayments) {
      console.log(payment);
      const paidAtString = payment.paid_at.toDate().toISOString();
      await this.stagingBigqueryDb
        .dataset("zurf")
        .table("payments_zurfers")
        .insert({
          publication_id: payment.publication_id,
          action: payment.action,
          hash: payment.hash,
          handle: payment.handle,
          address: payment.address,
          paid_at: paidAtString,
          reward: payment.reward,
          currency: payment.currency,
          gas_paid: payment.gas_paid,
          distribution_type: payment.distribution_type,
          rewarded_by: payment.rewarded_by,
          social_graph: payment.social_graph,
        });
    }
  }
}
