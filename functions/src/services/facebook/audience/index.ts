// Helpers
import { $facebookErrorHandler } from "../../../utils/error-handler";

// Local Helpers
import {
  _getFacebookLocations,
  _getFacebookInterests,
} from "./helpers/facebook-audience-requests";
import { _getMultipleFacebookCampaigns } from "../campaigns/helpers/facebook-campaign-requests";
import { _createMultipleFacebookAdSets } from "../helpers/adset-helpers/facebook-adset-requests";

// Types
import { NextFunction, Request } from "express";
import { EFacebookAdSetStatus } from "../../../types/modules/facebook/campaigns/enums";

export const audience = {
  getLocations: async function (req: Request, next: NextFunction) {
    try {
      const { locationSearchString } = req.params;
      const { access_token } = req.body.organization.facebookData;
      const locationsData = await _getFacebookLocations(
        { locationSearchString, access_token },
        next
      );
      return locationsData.data;
    } catch (error: any) {
      console.log("Error Getting Facebook Locations", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  getInterests: async function (req: Request, next: NextFunction) {
    try {
      const { interestSearchString } = req.params;
      const { access_token } = req.body.organization.facebookData;
      const interestsData = await _getFacebookInterests(
        { interestSearchString, access_token },
        next
      );
      return interestsData.data;
    } catch (error: any) {
      console.log("Error Getting Facebook Locations", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  saveAudience: async function (req: Request, next: NextFunction) {
    try {
      // Get  all campaigns back, we need the campaign id and the objective
      const { facebookCampaigns } = req.body.savedDBFacebookCampaign;
      const { audience, platform, pageId } = req.body.saveCampaignObject;
      const facebookPlatformCampaigns: any =
        await _getMultipleFacebookCampaigns(
          {
            facebookCampaignIds: facebookCampaigns as string[],
            targetFields: "id,account_id,objective",
          },
          next
        );
      const adSetPayloadArray = facebookPlatformCampaigns.map(
        (campaignItem: any) => {
          return {
            campaignId: campaignItem.id,
            adAccount: campaignItem.account_id,
            platform: platform,
            objective: campaignItem.objective,
            pageId: pageId,
            status: EFacebookAdSetStatus.paused,
            audience,
          };
        }
      );
      return await _createMultipleFacebookAdSets({ adSetPayloadArray }, next);
    } catch (error: any) {
      console.log("Error Saving Audience", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  getSavedCampaignAudience: async function (req: Request, next: NextFunction) {
    try {
      const { savedDBFacebookCampaign } = req.body;
      console.log("savedDBFacebookCampaign", savedDBFacebookCampaign);
    } catch (error: any) {
      console.log(
        "Error Getting Campaign Audience",
        await $facebookErrorHandler(error)
      );
      return next(await $facebookErrorHandler(error));
    }
  },
};
