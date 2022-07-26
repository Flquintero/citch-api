import { Request, Response, NextFunction, Router } from 'express';
import usersService from '../../services/users';
import organizationsService from '../../services/organizations';
import { $toDocReference } from '../../utils/firestorm-helpers';
const usersRouter = Router();

// /signup is to register an Owner of account. We will have a /add to add a teammate/client/user to account

usersRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  // creates user from authed user
  let userPathId = await usersService.create(req.body, next);
  // creates an org where the owner is the passed user
  req.body.userDocReference = await $toDocReference(userPathId as string);
  let organizationPathId = await organizationsService.create(req.body, next);
  // updates user with the created or reference
  res.json(
    await usersService.update(
      {
        pathId: userPathId as string,
        updateData: { organization: await $toDocReference(organizationPathId as string) },
      },
      next
    )
  );
});

usersRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = usersRouter;
