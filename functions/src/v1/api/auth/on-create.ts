import * as functions from 'firebase-functions';

export default functions.auth.user().onCreate((request: any, response: any) => {
  response.send('Hello from Firebase!');
});

// export const getHello = functions.https.onRequest((request: any, response: any) => {
//   response.send('Hello from Firebase!');
// });
