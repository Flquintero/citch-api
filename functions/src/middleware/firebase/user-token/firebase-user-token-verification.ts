import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { $genericErrorHandler } from '../../../utils/error-handler';
import { $idTokenDecoded } from '../../../utils/firebase/user-token/firebase-user-token';

let $idTokenVerification = async function (req: Request, res: Response, next: NextFunction) {
  try {
    req.body.uid = ((await $idTokenDecoded(req, next)) as DecodedIdToken).uid;
    req.body.provider = (
      (await $idTokenDecoded(req, next)) as DecodedIdToken
    ).firebase.sign_in_provider;
    return next();
  } catch (error: any) {
    console.log('Firebase id token verification error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $idTokenVerification };
