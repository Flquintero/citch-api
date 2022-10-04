// middleware
import { $appCheckVerification } from '../../middleware/firebase/app-check/firebase-app-check-verification';
import { $idTokenVerification } from '../../middleware/firebase/user-token/firebase-user-token-verification';
import { $getUserOrganization } from '../../middleware/organizations/fetch-user-organization';
// services
import facebookService from '../../services/facebook';
import organizationService from '../../services/organizations';
// type
import { Request, Response, NextFunction, Router } from 'express';
// declarations
const facebookRouter = Router();

facebookRouter.get(
  '/check-user-credentials',
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.checkUserToken(req, next));
  }
);

facebookRouter.get(
  '/consent-url',
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.getFacebookConsentUrl(req, next));
  }
);

facebookRouter.post(
  '/save-user',
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    const facebookUserData = await facebookService.getUserData(req.body.code, next);
    const updateObject = {
      pathId: `organizations/${req.body.organizationId}`,
      updateData: { ...facebookUserData },
    };
    await organizationService.update(updateObject, next);
    res.status(200).send('OK');
  }
);

facebookRouter.put(
  '/disconnect-user',
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    const updateObject = {
      pathId: `organizations/${req.body.organizationId}`,
      updateData: { facebookData: null },
    };
    await organizationService.update(updateObject, next);
    res.status(200).send('OK');
  }
);

facebookRouter.get(
  `/post-page/:postId`,
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.getPostPage(req, next));
  }
);

facebookRouter.get('*', async (req: Request, res: Response) => {
  res.status(404).send('This route does not exist.');
});

module.exports = facebookRouter;
