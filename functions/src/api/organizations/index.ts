// middleware
import { $appCheckVerification } from '../../middleware/firebase/app-check/firebase-app-check-verification';
import { $idTokenVerification } from '../../middleware/firebase/user-token/firebase-user-token-verification';
// services
import organizationsService from '../../services/organizations';
// type
import { Request, Response, NextFunction, Router } from 'express';
// declarations
const organizationsRouter = Router();

organizationsRouter.post(
  '/update',
  [$appCheckVerification, $idTokenVerification],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await organizationsService.update(req.body, next));
  }
);

organizationsRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = organizationsRouter;
