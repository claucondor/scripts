import { Timestamp } from "@google-cloud/firestore";

type PaymentDto = {
  pubId: string;
  handle: string;
  wallet: string;
  date: Timestamp;
  amount: number;
  payed_by: string;
  action: string;
  distribution: string;
};

export { PaymentDto };
