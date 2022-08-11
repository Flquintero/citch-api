// middleware
import { $appCheckVerification } from '../../middleware/firebase/app-check/firebase-app-check-verification';
import { $idTokenVerification } from '../../middleware/firebase/user-token/firebase-user-token-verification';
// helpers
import { $toDocReference } from '../../utils/firebase/firestorm/firebase-firestorm-helpers';
// services
import usersService from '../../services/users';
import organizationsService from '../../services/organizations';
// types
import { Request, Response, NextFunction, Router } from 'express';
// declarations
const usersRouter = Router();
const COLLECTION = 'users';

// /signup is to register an Owner of account. We will have a /add to add a teammate/client/user to account

usersRouter.post(
  '/signup',
  [$appCheckVerification, $idTokenVerification],
  async (req: Request, res: Response, next: NextFunction) => {
    await usersService.create(req, next);
    let organizationPathId = await organizationsService.create(req.body, next);
    //updates user with the created org reference
    res.json(
      await usersService.update(
        {
          pathId: `${COLLECTION}/${req.body.uid}`,
          updateData: { organization: await $toDocReference(organizationPathId as string) },
        },
        next
      )
    );
  }
);

usersRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('Cannot find route');
});

module.exports = usersRouter;
