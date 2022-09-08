import { Request, Response, NextFunction } from 'express';
import { $genericErrorHandler } from '../../../utils/error-handler';
import { $appCheckTokenDecoded } from '../../../utils/firebase/app-check/firebase-app-check-token';

let $appCheckVerification = async function (req: Request, res: Response, next: NextFunction) {
  try {
    await $appCheckTokenDecoded(req, next);
    return next();
  } catch (error: any) {
    console.log('App Check token error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $appCheckVerification };
