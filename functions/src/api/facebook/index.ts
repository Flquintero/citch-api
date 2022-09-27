// middleware
import { $appCheckVerification } from '../../middleware/firebase/app-check/firebase-app-check-verification';
import { $idTokenVerification } from '../../middleware/firebase/user-token/firebase-user-token-verification';
import { $getUserOrganizationId } from '../../middleware/organizations/fetch-user-organization';
// services
import facebookService from '../../services/facebook';
// type
import { Request, Response, NextFunction, Router } from 'express';
// declarations
const facebookRouter = Router();

facebookRouter.get(
  '/consent-url',
  [$appCheckVerification, $idTokenVerification, $getUserOrganizationId],
  async (req: Request, res: Response, next: NextFunction) => {
    // const updateObject = {
    //   pathId: `organizations/${req.body.organizationId}`,
    //   updateData: req.body.updateData,
    // };
    res.json(await facebookService.getFacebookConsentUrl(req, next));
  }
);

facebookRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = facebookRouter;
