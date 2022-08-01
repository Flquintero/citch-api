import { admin } from '../config/firebase';
import { Request, Response, NextFunction } from 'express';
import { $genericErrorHandler } from './error-handler';

let $idTokenVerification = async function (req: Request, res: Response, next: NextFunction) {
  const idToken = req.header('Authorization');

  if (!idToken) {
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }

  try {
    await admin.auth().verifyIdToken(idToken);
    return next();
  } catch (error: any) {
    console.log('Firebase id token error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $idTokenVerification };
