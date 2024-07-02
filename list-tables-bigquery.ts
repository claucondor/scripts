import {BigQuery} from '@google-cloud/bigquery';

const bigquery = new BigQuery({
    projectId: 'zurf-social-app', // replace with your project id
});

async function listTables(datasetId: string) {
    // Lists all tables in the dataset
    const [tables] = await bigquery.dataset(datasetId).getTables();

    console.log('Tables:');
    tables.forEach(table => console.log(table.id));
}

const run = async () => {
    await listTables('zurf');
};

run();