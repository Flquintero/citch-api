import { Request, Response, NextFunction } from 'express';
import { $genericErrorHandler } from '../error-handler';
import { $idTokenDecoded } from './firebase-user-token';

let $idTokenVerification = async function (req: Request, res: Response, next: NextFunction) {
  try {
    await $idTokenDecoded(req, next);
    return next();
  } catch (error: any) {
    console.log('Firebase id token verification error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $idTokenVerification };
