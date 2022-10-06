// types
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../types/modules/users';
// services
import usersService from '../../services/users';
import organizationsService from '../../services/organizations';
// handlers
import { $genericErrorHandler } from '../../utils/error-handler';

const $getUserOrganization = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body.uid;
    const user = await usersService.read({ id }, next);
    const organizationId = (user as IUser).organization.id;
    req.body.organizationId = organizationId;
    req.body.organization = await organizationsService.read({ id: organizationId }, next);
    return next();
  } catch (error: any) {
    console.log('Firebase id token verification error', error);
    return next(await $genericErrorHandler({ code: 401, message: 'Unauthorized' }));
  }
};
export { $getUserOrganization };
