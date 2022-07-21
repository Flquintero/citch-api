import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.APP_FIREBASE_PRIVATE_KEY,
    projectId: process.env.APP_FIREBASE_PROJECT_ID,
    clientEmail: process.env.APP_FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.APP_FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
export { admin, db, functions };
