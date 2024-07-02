import {BigQuery, Dataset, Table} from '@google-cloud/bigquery';

const bigquerySource = new BigQuery({
    projectId: 'zurf-social', 
});

const bigqueryTarget = new BigQuery({
    projectId: 'zurf-social-app', 
});

const sourceDatasetId = 'zurf';
const sourceTableId = 'payments_zurfers';
const targetDatasetId = 'zurf';
const targetTableId = 'payments_zurfers';

async function copyTable(sourceTable: Table, targetDataset: Dataset, targetTableId: string) {
    const [tables] = await targetDataset.getTables();
    if (!tables.map(table => table.id).includes(targetTableId)) {
        const [metadata] = await sourceTable.getMetadata();
        await targetDataset.createTable(targetTableId, {schema: metadata.schema});
    }
    await sourceTable.copy(targetDataset.table(targetTableId));
}

const run = async () => {
    const sourceDataset = bigquerySource.dataset(sourceDatasetId);
    const sourceTable = sourceDataset.table(sourceTableId);
    const targetDataset = bigqueryTarget.dataset(targetDatasetId);

    await copyTable(sourceTable, targetDataset, targetTableId);
};

run();