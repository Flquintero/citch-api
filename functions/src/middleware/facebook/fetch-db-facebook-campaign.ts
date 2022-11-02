import { Request, Response, NextFunction } from 'express';
import facebookService from '../../services/facebook';

let $getDBFacebookCampaign = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { campaignData } = req.body;
    const { campaignId } = campaignData;
    const campaign = await facebookService.getCampaign({ id: campaignId }, next);
    req.body.savedFacebookCampaign = campaign;
    next();
  } catch (error: any) {
    return next(await error);
  }
};

export { $getDBFacebookCampaign };
