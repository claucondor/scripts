import { Firestore, DocumentReference, DocumentData } from '@google-cloud/firestore';

const firestoreSource = new Firestore({
    projectId: 'zurf-social',
});

const firestoreTarget = new Firestore({
    projectId: 'zurf-social-app',
});

const MAX_RETRIES = 5;

async function setWithRetry(ref: DocumentReference, data: DocumentData) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            await ref.set(data);
            return;
        } catch (error) {
            if (error instanceof Error && error.message === 'Deadline exceeded' && i < MAX_RETRIES - 1) {
                console.log(`Attempt ${i + 1} failed with error: ${error.message}. Retrying...`);
            } else {
                throw error;
            }
        }
    }
}

const copyCollection = async (sourceCollection: string, targetCollection: string) => {
    const sourceRef = firestoreSource.collection(sourceCollection).where('status', '==', 'monitoring');
    const targetRef = firestoreTarget.collection(targetCollection);

    console.log(`Starting to copy documents from ${sourceCollection} to ${targetCollection}`);

    const snapshot = await sourceRef.get();

    let count = 0;
    for (let doc of snapshot.docs) {
        const data = doc.data();

        const existingDocSnapshot = await targetRef.where('externalId', '==', data.externalId).limit(1).get();
        if (!existingDocSnapshot.empty) {
            console.log(`Document with externalId ${data.externalId} already exists in the target collection. Skipping...`);
            continue;
        }

        await setWithRetry(targetRef.doc(data.id), data);

        count++;

        console.log(`Copied ${count} documents so far...`);
        
    };


    console.log(`Finished copying ${count} documents from ${sourceCollection} to ${targetCollection}`);
};

const run = async () => {
    await copyCollection('wav3s', 'wav3s');
};

run();