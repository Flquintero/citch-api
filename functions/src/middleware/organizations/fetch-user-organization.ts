// types
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../types/services/users';
// services
import usersService from '../../services/users';
// handlers
import { $genericErrorHandler } from '../../utils/error-handler';

const $getUserOrganizationId = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body.uid;
    const user = await usersService.read({ id }, next);
    req.body.organizationId = (user as IUser).organization.id;
    return next();
  } catch (error: any) {
    console.log('Firebase id token verification error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $getUserOrganizationId };
