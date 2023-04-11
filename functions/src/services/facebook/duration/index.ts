// Helpers
import { $facebookErrorHandler } from "../../../utils/error-handler";

// Local Helpers
import {
  _getMultipleFacebookCampaigns,
  _getFacebookCampaignEdge,
  _getMultipleFacebookCampaignEdge,
} from "../campaigns/helpers/facebook-campaign-requests";
import {
  _createMultipleFacebookAdSets,
  _updateMultipleFacebookAdSets,
  _copyMultipleFacebookAdSets,
} from "../helpers/adset-helpers/facebook-adset-requests";

// Service
import facebookService from "../../../services/facebook";

// Types
import { NextFunction, Request } from "express";

export const duration = {
  getCampaignDuration: async function (req: Request, next: NextFunction) {
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
  // THIS IS BECAUSE WE NEED TO CHANGE A FLAG THE FIRST TIME THAT IT IS SAVED
  saveCampaignDuration: async function (req: Request, next: NextFunction) {
    try {
      // Get  all campaigns back, we need the campaign id and the objective
      const { facebookCampaigns } = req.body.savedDBFacebookCampaign;
      const { campaignId, campaignDates } = req.body.saveCampaignObject;

      const facebookAdSets: any = await _getMultipleFacebookCampaignEdge(
        {
          campaignIds: facebookCampaigns as string[],
          targetEdge: "adsets",
          targetFields: "id,name",
        },
        next
      );
      const adSets = facebookAdSets[0].data;
      if (!adSets[0]) {
        return;
      }
      const adSetCopyPayloadArray = adSets.map(
        (adSet: { id: string; name: string }) => {
          return {
            adSetId: adSet.id,
            adSetName: adSet.name,
            updateData: {
              start_time: campaignDates.startDate,
              end_time: campaignDates.endDate,
            },
          };
        }
      );
      await _copyMultipleFacebookAdSets({ adSetCopyPayloadArray }, next);
      // TO DO: DELETE ORIGINAL ADSETS
      // SEEMS LIKE AFTER THIS WE CAN UPDATE WITHOUT A PROBLEM
      // set date updated after everything works
      const updateCampaignPayload = {
        campaignId,
        updateData: { durationSavedByUser: true },
      };
      return await facebookService.campaigns.updateCampaign(
        updateCampaignPayload,
        next
      );
    } catch (error: any) {
      console.log("Error Saving Audience", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  updateCampaignDuration: async function (req: Request, next: NextFunction) {
    try {
      const { facebookCampaigns } = req.body.savedDBFacebookCampaign;
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
