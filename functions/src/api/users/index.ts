import { Request, Response, NextFunction, Router } from 'express';
import usersService from '../../services/users';
import organizationsService from '../../services/organizations';
import { _getCreateUserPayload, _getCreateOrganizationPayload } from './helpers/payload-builder';

const usersRouter = Router();

// /signup is to register an Owner of account. We will have a /add to add a teammate/client/user to account

usersRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  // creates user from authed user
  let userPathId = await usersService.create(await _getCreateUserPayload(req.body), next);
  // creates an org where the owner is the passed user
  let organizationPathId = await organizationsService.create(
    await _getCreateOrganizationPayload(userPathId as string, req.body),
    next
  );
  // updates user with the created or reference
  res.json(await usersService.update({ organizationPathId, userPathId }, next));
});

usersRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = usersRouter;
