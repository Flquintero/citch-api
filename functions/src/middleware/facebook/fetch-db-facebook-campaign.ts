import { Request, Response, NextFunction } from "express";
import { IDBFacebookCampaign } from "../../types/modules/facebook/campaigns/interfaces";
import facebookService from "../../services/facebook";

let $getDBFacebookCampaign = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let campaignId;
    // two ways that campaignIds can be sent
    // In a campaignObject with doing a post or put to update campaign
    if (req.body.saveCampaignObject)
      campaignId = req.body.saveCampaignObject.campaignId;
    // In the params in a get
    if (req.params.campaignId) campaignId = req.params.campaignId;
    const campaign: IDBFacebookCampaign | void =
      await facebookService.campaigns.getCampaign({ id: campaignId }, next);
    req.body.savedFBFacebookCampaignId = campaignId;
    req.body.savedDBFacebookCampaign = campaign;
    next();
  } catch (error: any) {
    return next(await error);
  }
};

export { $getDBFacebookCampaign };
