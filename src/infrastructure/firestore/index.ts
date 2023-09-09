const Firestore = require("@google-cloud/firestore");

export function connectToFirestore(PROJECT_ID: string): any {
  return new Firestore({
    projectId: PROJECT_ID,
  });
}
