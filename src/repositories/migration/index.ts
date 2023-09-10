import { IMigrationRepository } from "./interface";
import { OldWav3s } from "../../entities/migration/oldWav3s";
import { NewWav3 } from "../../entities/migration/newWav3s";
import { PaymentDto } from "../../entities/migration/dto/payment-dto";
import { BigQuery } from "@google-cloud/bigquery";

const ZURF = "zurf";
const PAYMENTS = "payments";
export class MigrationRepository implements IMigrationRepository {
  oldFirestoreDb: any;
  prodNewFirestoreDb: any;
  stagingNewFirestoreDb: any;

  prodBigqueryDb: any;
  stagingBigqueryDb: any;

  constructor(
    oldFirestoreDb: any,
    prodNewFirestoreDb: any,
    stagingNewFirestoreDb: any,
    prodBigqueryDb: BigQuery,
    stagingBigqueryDb: BigQuery
  ) {
    this.oldFirestoreDb = oldFirestoreDb;
    this.prodNewFirestoreDb = prodNewFirestoreDb;
    this.stagingNewFirestoreDb = stagingNewFirestoreDb;
    this.prodBigqueryDb = prodBigqueryDb;
    this.stagingBigqueryDb = stagingBigqueryDb;
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

    const query = `
    INSERT INTO \`${PROJECT_ID}.${ZURF}.${PAYMENTS}\` (pubId, handle, wallet, date, amount, payed_by, action, distribution)
    VALUES 
  `;

    const values = payments.map(
      (payment) =>
        `('${payment.pubId}', '${payment.handle}', '${payment.wallet}', '${payment.date}', ${payment.amount}, '${payment.payed_by}', '${payment.action}', '${payment.distribution}')`
    );
    const insertQuery = query + values.join(", ");

    env
      ? await this.prodBigqueryDb.query(insertQuery)
      : await this.stagingBigqueryDb.query(insertQuery);
  }
}
