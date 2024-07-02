const Firestore = require('@google-cloud/firestore');
const axios = require('axios');
const FieldValue = Firestore.FieldValue;

export function connectToFirestore(): any {
  return new Firestore({
    projectId: 'zurf-social-app',
  });
}





const run = async () => {
    const firestore = connectToFirestore();

    const usersRef = firestore.collection('users');
    const profilesRef = firestore.collection('profiles');
    let successfulRequests = 0;
    let totalRequestTime = 0;

    const snapshot = await usersRef.get();

    const unsuccessfulTokens: string[] = [];

    for (let doc of snapshot.docs) {
        const data = doc.data();

        await usersRef.doc(doc.id).update({
            lensPublications: FieldValue.delete(),
            lensNextCursor: FieldValue.delete()
        });

        const profileSnapshot = await profilesRef
            .where('email', '==', data.email)
            .where('socialGraph', '==', 'lens')
            .get();
        const profiles: any[] = [];

        for (let profileDoc of profileSnapshot.docs) {
            await profilesRef.doc(profileDoc.id).update({
                cursor: FieldValue.delete(),
                lastCursorSavedAt: FieldValue.delete(),
                personalFeed: FieldValue.delete()
            });
        
            const profileData = profileDoc.data();
            profiles.push(profileData);
        }
    

        try {
            const startTime = Date.now();

            const response = await axios.get('https://zurf-api-dot-zurf-social-app.uc.r.appspot.com/feed/multi?videos=true', {
                headers: {
                    'User-Agent': 'bruno-zurf',
                    'api-key': 'zurfInternalKey1q2w!*',
                    'token': data.token
                },
                timeout: 5 * 60 * 1000
            });


            const endTime = Date.now();
            const requestTime = endTime - startTime;
            successfulRequests++;
            totalRequestTime += requestTime;

            console.log(`Token ${data.token} was successful.`);

        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.log(`The user with token ${data.token} has a profile but had removed permission to zurf.`);
            } else {
                console.error(`Error with token ${data.token}:`, error.message);
                if (error.response) {
                    console.error('Response:', error.response);
                }
                if (error.config) {
                    console.error('Headers:', error.config.headers);
                }
            }
            unsuccessfulTokens.push(data.token);
        }
    };


    const averageRequestTime = totalRequestTime / successfulRequests;
    console.log(`Average request time for successful requests: ${averageRequestTime}ms`);

    console.log('Unsuccessful tokens:', unsuccessfulTokens);
};

run();


