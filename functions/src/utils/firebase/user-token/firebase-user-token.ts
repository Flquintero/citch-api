import { admin } from '../../../config/firebase';
import { Request, NextFunction } from 'express';
import { $genericErrorHandler } from '../../error-handler';

let $idTokenDecoded = async function (req: Request, next: NextFunction) {
  try {
    const idToken = req.header('Authorization');
    if (!idToken) {
      return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
    }
    return admin.auth().verifyIdToken(idToken);
  } catch (error: any) {
    console.log('Firebase id token error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $idTokenDecoded };
