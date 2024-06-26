// middleware
import { $appCheckVerification } from '../../middleware/firebase/app-check/firebase-app-check-verification';
import { $idTokenVerification } from '../../middleware/firebase/user-token/firebase-user-token-verification';
import { $getUserOrganization } from '../../middleware/organizations/fetch-user-organization';
// services
import organizationsService from '../../services/organizations';
// type
import { Request, Response, NextFunction, Router } from 'express';
// declarations
const organizationsRouter = Router();

organizationsRouter.post(
  '/update',
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    const updateObject = {
      pathId: `organizations/${req.body.organizationId}`,
      updateData: req.body.updateData,
    };
    res.json(await organizationsService.update(updateObject, next));
  }
);

organizationsRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = organizationsRouter;
