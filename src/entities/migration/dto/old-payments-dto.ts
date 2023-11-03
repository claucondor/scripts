import { Timestamp } from "@google-cloud/firestore";

export type OldPaymentDto = {
  publicationId: string | null;
  actionEvent: string | null;
  hash: string | null;
  handle: string | null;
  address: string | null;
  date: Timestamp | null;
  reward: number | null;
  currency: string | null;
  gasPaid: number | null;
  payed_by?: string | null;
};
