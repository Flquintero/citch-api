import { Request, Response, NextFunction } from "express";
import { IDBFacebookCampaign } from "../../types/modules/facebook/campaigns/interfaces";
import facebookService from "../../services/facebook";

let $getDBFacebookCampaign = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { saveCampaignObject } = req.body;
    const { campaignId } = saveCampaignObject;
    const campaign: IDBFacebookCampaign | void =
      await facebookService.campaigns.getCampaign({ id: campaignId }, next);
    req.body.savedDBFacebookCampaign = campaign;
    next();
  } catch (error: any) {
    return next(await error);
  }
};

export { $getDBFacebookCampaign };
