import { connectToBigQuery, connectToFirestore } from "./src/infrastructure";

const oldProyect = "quand-crypto-fund";
const prodProyect = "zurf-social";
const stagingProyect = "zurf-social-staging";

const oldFirestoreDb = connectToFirestore(oldProyect);

const stagingFirestoreDb = connectToFirestore(stagingProyect);
const prodProyectFirestoreDb = connectToFirestore(prodProyect);

const stagingBigQueryDb = connectToBigQuery(stagingProyect);
const prodProyectBigQueryDb = connectToBigQuery(prodProyect);
