import { admin } from '../config/firebase';
import { Request, Response, NextFunction } from 'express';
import { $genericErrorHandler } from '../utils/error-handler';

let $appCheckVerification = async function (req: Request, res: Response, next: NextFunction) {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  //   console.log('token', appCheckToken);

  if (!appCheckToken) {
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }

  try {
    await admin.appCheck().verifyToken(appCheckToken);
    return next();
  } catch (error: any) {
    console.log('token error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $appCheckVerification };
