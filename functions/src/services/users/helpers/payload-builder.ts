import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Request } from 'express';
import { FieldValue } from '../../../config/firebase';

let _getCreateUserPayload = async (req: Request, decodedToken: DecodedIdToken | void) => {
  return {
    ...req['body'],
    type: 'OWNER',
    enabled: 'false',
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
    provider: (decodedToken as DecodedIdToken).firebase.sign_in_provider,
    uid: (decodedToken as DecodedIdToken).uid,
  };
};

export { _getCreateUserPayload };
