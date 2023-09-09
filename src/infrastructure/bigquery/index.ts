import { BigQuery } from "@google-cloud/bigquery";

export function connectToBigQuery(PROJECT_ID: string): BigQuery {
  return new BigQuery({
    projectId: PROJECT_ID,
  });
}
