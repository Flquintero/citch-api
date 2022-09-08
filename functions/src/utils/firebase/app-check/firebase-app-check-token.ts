import { admin } from '../../../config/firebase';
import { Request, NextFunction } from 'express';
import { $genericErrorHandler } from '../../error-handler';

let $appCheckTokenDecoded = async function (req: Request, next: NextFunction) {
  try {
    const appCheckToken = req.header('X-Firebase-AppCheck');

    if (!appCheckToken) {
      return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
    }
    await admin.appCheck().verifyToken(appCheckToken);
  } catch (error: any) {
    console.log('Firebase app check token error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $appCheckTokenDecoded };
