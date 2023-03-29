// middleware
import { $appCheckVerification } from "../../middleware/firebase/app-check/firebase-app-check-verification";
import { $idTokenVerification } from "../../middleware/firebase/user-token/firebase-user-token-verification";
import { $getUserOrganization } from "../../middleware/organizations/fetch-user-organization";
import { $getFacebookPage } from "../../middleware/facebook/fetch-user-facebook-page";
import { $getFacebookPost } from "../../middleware/facebook/fetch-user-facebook-post";
import { $getDBFacebookCampaign } from "../../middleware/facebook/fetch-db-facebook-campaign";
// services
import facebookService from "../../services/facebook";
import organizationService from "../../services/organizations";
// type
import { Request, Response, NextFunction, Router } from "express";
// declarations
const facebookRouter = Router();

facebookRouter.get(
  "/check-user-credentials",
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.auth.checkUserAuthToken(req, next));
  }
);

facebookRouter.get(
  "/consent-url",
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.auth.getFacebookConsentUrl(req, next));
  }
);

facebookRouter.get(
  `/post-page/:postId`,
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.pages.getPostPage(req, next));
  }
);

facebookRouter.get(
  `/user-pages`,
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.pages.getUserPages(req, next));
  }
);

facebookRouter.post(
  "/save-user",
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    const facebookUserData = await facebookService.auth.getUserAuthData(
      req.body.code,
      next
    );
    const updateObject = {
      pathId: `organizations/${req.body.organizationId}`,
      updateData: { ...facebookUserData },
    };
    await organizationService.update(updateObject, next);
    res.status(200).send("OK");
  }
);

facebookRouter.post(
  "/confirm-accounts",
  [
    $appCheckVerification,
    $idTokenVerification,
    $getUserOrganization,
    $getFacebookPage,
    $getFacebookPost,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const connectedStatusMessage = await facebookService.pages.linkUserAccounts(
      req,
      next
    );
    const postId = req.body.facebookPostData?.id;
    res.json({
      status: connectedStatusMessage,
      ...(postId ? { postId: postId } : null),
    });
  }
);

facebookRouter.post(
  "/save-campaign-objective",
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.campaigns.saveCampaignObjective(req, next));
  }
);

facebookRouter.put(
  "/update-campaign-objective",
  [
    $appCheckVerification,
    $idTokenVerification,
    $getUserOrganization,
    $getDBFacebookCampaign,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(
      await facebookService.campaigns.updateCampaignObjective(req, next)
    );
  }
);

facebookRouter.put(
  "/disconnect-user",
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    const updateObject = {
      pathId: `organizations/${req.body.organizationId}`,
      updateData: { facebookData: null },
    };
    await organizationService.update(updateObject, next);
    res.status(200).send("OK");
  }
);

facebookRouter.get(
  "/locations/:locationSearchString",
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.audience.getLocations(req, next));
  }
);

facebookRouter.get(
  "/interests/:interestSearchString",
  [$appCheckVerification, $idTokenVerification, $getUserOrganization],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.audience.getInterests(req, next));
  }
);

facebookRouter.post(
  "/save-campaign-audience",
  [
    $appCheckVerification,
    $idTokenVerification,
    $getUserOrganization,
    $getDBFacebookCampaign,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(await facebookService.audience.saveAudience(req, next));
  }
);

facebookRouter.get(
  "/campaign-audience/:campaignId",
  [
    $appCheckVerification,
    $idTokenVerification,
    $getUserOrganization,
    $getDBFacebookCampaign,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(
      await facebookService.audience.getSavedCampaignAudience(req, next)
    );
  }
);

facebookRouter.put(
  "/campaign-audience",
  [
    $appCheckVerification,
    $idTokenVerification,
    $getUserOrganization,
    $getDBFacebookCampaign,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(
      await facebookService.audience.updateSavedCampaignAudience(req, next)
    );
  }
);

facebookRouter.get("*", async (req: Request, res: Response) => {
  res.status(404).send("This route does not exist.");
});

module.exports = facebookRouter;
