import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Request } from 'express';

let _getCreateUserPayload = async (req: Request, decodedToken: DecodedIdToken | void) => {
  return {
    fields: {
      // ...req['body'],
      provider: {
        stringValue: (decodedToken as DecodedIdToken).firebase.sign_in_provider,
      },
      uid: {
        stringValue: (decodedToken as DecodedIdToken).uid,
      },
      // type: 'OWNER',
      // enabled: 'false',
      // createdOn: {
      //   timestampValue: Timestamp.now(),
      // },
      // updatedOn: {
      //   timestampValue: Timestamp.now(),
      // },
    },
  };
};

export { _getCreateUserPayload };
