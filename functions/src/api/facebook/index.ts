// middleware
import { $appCheckVerification } from '../../middleware/firebase/app-check/firebase-app-check-verification';
import { $idTokenVerification } from '../../middleware/firebase/user-token/firebase-user-token-verification';
import { $getUserOrganizationId } from '../../middleware/organizations/fetch-user-organization';
// services
import facebookService from '../../services/facebook';
import organizationService from '../../services/organizations';
// type
import { Request, Response, NextFunction, Router } from 'express';
import { IFacebookConnectData } from '../../types/services/facebook';
// declarations
const facebookRouter = Router();

facebookRouter.get(
  '/consent-url',
  [$appCheckVerification, $idTokenVerification, $getUserOrganizationId],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.getFacebookConsentUrl(req, next));
  }
);

facebookRouter.post(
  '/save-user',
  [$appCheckVerification, $idTokenVerification, $getUserOrganizationId],
  async (req: Request, res: Response, next: NextFunction) => {
    const facebookUserData = await facebookService.getUserData(
      req.body.facebookConnectData as IFacebookConnectData,
      next
    );
    const updateObject = {
      pathId: `organizations/${req.body.organizationId}`,
      updateData: { ...facebookUserData },
    };
    await organizationService.update(updateObject, next);
    res.status(200);
  }
);

facebookRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = facebookRouter;
