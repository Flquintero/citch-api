// Helpers
import { $facebookErrorHandler } from "../../../utils/error-handler";

// Local Helpers
import {
  _getFacebookLocations,
  _getFacebookInterests,
} from "./helpers/facebook-audience-requests";
import {
  _getMultipleFacebookCampaigns,
  _getFacebookCampaignEdge,
  _getMultipleFacebookCampaignEdge,
} from "../campaigns/helpers/facebook-campaign-requests";
import {
  _createMultipleFacebookAdSets,
  _updateMultipleFacebookAdSets,
} from "../helpers/adset-helpers/facebook-adset-requests";
import {
  _formatChosenLocations,
  _formatGender,
} from "./helpers/format-citch-audience-payload";

// Types
import { NextFunction, Request } from "express";
import { EFacebookAdSetStatus } from "../../../types/modules/facebook/campaigns/enums";

export const audience = {
  getLocations: async function (req: Request, next: NextFunction) {
    try {
      const { locationSearchString } = req.params;
      const locationsData = await _getFacebookLocations(
        {
          locationSearchString,
          locationTypes: `["country", "region", "city", "zip"]`,
        },
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
      const interestsData = await _getFacebookInterests(
        { interestSearchString },
        next
      );
      return interestsData.data;
    } catch (error: any) {
      console.log("Error Getting Facebook Locations", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  saveCampaignAudience: async function (req: Request, next: NextFunction) {
    try {
      // Get  all campaigns back, we need the campaign id and the objective
      const { facebookCampaigns, facebookPage, platform, postPlacement } =
        req.body.savedDBFacebookCampaign;
      const { audience } = req.body.saveCampaignObject;
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
            postPlacement,
            objective: campaignItem.objective,
            pageId: facebookPage,
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
  getCampaignAudience: async function (req: Request, next: NextFunction) {
    try {
      const { facebookCampaigns } = req.body.savedDBFacebookCampaign;
      // going directly for the first one in the array of campaigns but in the future we might need to get multiple and compare
      // im assuming that they will always have the same data in citch reach and hence just pick the first
      const facebookAdSetTargeting: any = await _getFacebookCampaignEdge(
        {
          campaignId: facebookCampaigns[0] as string,
          targetEdge: "adsets",
          targetFields: "targeting",
        },
        next
      );
      if (!facebookAdSetTargeting.data[0]) {
        return;
      }
      const { age_max, age_min, genders, geo_locations, flexible_spec } =
        facebookAdSetTargeting.data[0].targeting;
      const savedAudience = {
        ageMin: age_min.toString(),
        ageMax: age_max.toString(),
        gender: await _formatGender(genders),
        chosenLocations: await _formatChosenLocations(geo_locations),
        ...(flexible_spec && flexible_spec[0]?.interests
          ? { chosenInterests: flexible_spec[0].interests }
          : null),
      };
      return savedAudience;
      // choose the first one - in the future maybe we need to compare that they are the same
      // Change the response into the audience structure that we use in FE
    } catch (error: any) {
      console.log(
        "Error Getting Campaign Audience",
        await $facebookErrorHandler(error)
      );
      return next(await $facebookErrorHandler(error));
    }
  },
  updateCampaignAudience: async function (req: Request, next: NextFunction) {
    try {
      const { facebookCampaigns, platform, postPlacement } =
        req.body.savedDBFacebookCampaign;
      const { audience } = req.body.saveCampaignObject;
      // going directly for the first one in the array of campaigns but in the future we might need to get multiple and compare
      // im assuming that they will always have the same data in citch reach and hence just pick the first
      const facebookAdSets: any = await _getMultipleFacebookCampaignEdge(
        {
          campaignIds: facebookCampaigns as string[],
          targetEdge: "adsets",
          targetFields: "id",
        },
        next
      );
      const adSetIds = facebookAdSets[0].data;
      if (!adSetIds[0]) {
        return;
      }
      const adSetPayloadArray = adSetIds.map((adSetId: { id: string }) => {
        return {
          adSetId: adSetId.id,
          audience,
          platform,
          postPlacement,
        };
      });
      return await _updateMultipleFacebookAdSets({ adSetPayloadArray }, next);
    } catch (error: any) {
      console.log(
        "Error Updating Campaign Audience",
        await $facebookErrorHandler(error)
      );
      return next(await $facebookErrorHandler(error));
    }
  },
};
