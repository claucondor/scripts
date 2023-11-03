import { Timestamp } from "@google-cloud/firestore";

export type NewPaymentDto = {
  publication_id: string;
  action: string;
  hash?: string | null;
  handle: string;
  address: string;
  paid_at: Timestamp;
  reward: number;
  currency: string;
  gas_paid?: number | null;
  distribution_type: string;
  rewarded_by: string;
  social_graph: string;
};
