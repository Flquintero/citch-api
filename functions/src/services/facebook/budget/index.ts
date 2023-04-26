// Helpers
import { $facebookErrorHandler } from "../../../utils/error-handler";

// Local Helpers
import {
  _getMultipleFacebookCampaigns,
  _updateMultipleFacebookCampaigns,
  _getFacebookCampaign,
  _getMultipleFacebookCampaignEdge,
} from "../campaigns/helpers/facebook-campaign-requests";
import {
  _createMultipleFacebookAdSets,
  _updateMultipleFacebookAdSets,
  _copyMultipleFacebookAdSets,
  _deleteMultipleFacebookAdSets,
} from "../helpers/adset-helpers/facebook-adset-requests";

// Service
import facebookService from "../../../services/facebook";

// Types
import { NextFunction, Request } from "express";
import { EFacebookBudgetHelper } from "../../../types/modules/facebook/campaigns/enums";

export const budget = {
  getCampaignBudget: async function (req: Request, next: NextFunction) {
    try {
      const { facebookCampaigns, budgetSavedByUser } =
        req.body.savedDBFacebookCampaign;
      if (!budgetSavedByUser) {
        return null;
      }
      // going directly for the first one in the array of campaigns but in the future we might need to get multiple and compare
      // im assuming that they will always have the same data in citch reach and hence just pick the first
      const facebookCampaignBudget: any = await _getFacebookCampaign(
        {
          campaignId: facebookCampaigns[0] as string,
          targetFields: "lifetime_budget",
        },
        next
      );
      const { lifetime_budget } = facebookCampaignBudget;
      if (!lifetime_budget) {
        return;
      }
      return {
        budget: lifetime_budget / EFacebookBudgetHelper.multiplier,
      };
      // choose the first one - in the future maybe we need to compare that they are the same
      // Change the response into the audience structure that we use in FE
    } catch (error: any) {
      console.log(
        "Error Getting Campaign Budget",
        await $facebookErrorHandler(error)
      );
      return next(await $facebookErrorHandler(error));
    }
  },
  // THIS IS BECAUSE WE NEED TO CHANGE A FLAG THE FIRST TIME THAT IT IS SAVED
  saveCampaignBudget: async function (req: Request, next: NextFunction) {
    try {
      // Get  all campaigns back, we need the campaign id and the objective
      const { facebookCampaigns } = req.body.savedDBFacebookCampaign;
      const { campaignId, campaignBudget } = req.body.saveCampaignObject;
      await _updateMultipleFacebookCampaigns(
        {
          campaignData: {
            lifetime_budget:
              parseInt(campaignBudget.budget) *
              EFacebookBudgetHelper.multiplier,
          },
          facebookCampaigns,
        },
        next
      );

      // set date updated after everything works
      const updateCampaignPayload = {
        campaignId,
        updateData: { budgetSavedByUser: true },
      };
      return await facebookService.campaigns.updateCampaign(
        updateCampaignPayload,
        next
      );
    } catch (error: any) {
      console.log("Error Saving Budget", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  updateCampaignBudget: async function (req: Request, next: NextFunction) {
    try {
      //   const { facebookCampaigns } = req.body.savedDBFacebookCampaign;
      //   const { campaignDates } = req.body.saveCampaignObject;
    } catch (error: any) {
      console.log(
        "Error Updating Campaign Budget",
        await $facebookErrorHandler(error)
      );
      return next(await $facebookErrorHandler(error));
    }
  },
};
