import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
const secrets = functions.config().doppler;

// Uncomment below to test if secrets are being updated - can check in the google cloud console for the project and see the logs not the variables
// THESE NEEDS TO BE COMMENTED
// console.log('secrets', secrets);

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: secrets.APP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    projectId: secrets.APP_FIREBASE_PROJECT_ID,
    clientEmail: secrets.APP_FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: secrets.APP_FIREBASE_DATABASE_URL,
});

const FieldValue = admin.firestore.FieldValue;

const db = admin.firestore();
export { admin, db, functions, FieldValue, secrets };
