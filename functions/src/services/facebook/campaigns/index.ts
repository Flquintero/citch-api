// General Helpers
import {
  $facebookErrorHandler,
  $firestormErrorHandler,
} from "../../../utils/error-handler";

// Local Helpers
import {
  _getCreateDBFacebookCampaignPayload,
  _getupdateDBFacebookCampaignPayload,
} from "./helpers/campaign-payload-builder";
import {
  _createMultipleFacebookCampaigns,
  _createFacebookCampaign,
  _updateFacebookCampaign,
  _deleteMultipleFacebookCampaigns,
  _deleteFacebookCampaign,
} from "./helpers/facebook-campaign-requests";

// Types
import {
  IDBFacebookCampaign,
  IDBUpdateFacebookCampaignPayload,
  ICreateMultipleCampaignsResponse,
  ISaveFacebookCampaignObject,
  IUpdateFacebookCampaignPayload,
} from "../../../types/modules/facebook/campaigns/interfaces";
import {
  EFacebookObjectiveIdentifier,
  EFacebookObjectiveValue,
} from "../../../types/modules/facebook/campaigns/enums";
import { IReadObject } from "../../../types/general/services";
import { NextFunction, Request } from "express";

// Constants
import { db } from "../../../config/firebase";
const FACEBOOK_CAMPAIGNS_DB = db.collection("facebook_campaigns");

// Methods
export const campaigns = {
  getCampaign: async function (options: IReadObject, next: NextFunction) {
    try {
      const { id } = options;
      const campaign = await FACEBOOK_CAMPAIGNS_DB.doc(id).get();
      // add the below when we add to also get the campaigns from facebook
      // if (includeFacebookCampaign) {
      //   // include code to get existing facebook campaigns
      // }
      return campaign.data();
    } catch (error: any) {
      return next(await $firestormErrorHandler(error));
    }
  },
  createCampaign: async function (
    options: IDBFacebookCampaign,
    next: NextFunction
  ) {
    try {
      const savedCampaign = await FACEBOOK_CAMPAIGNS_DB.add(
        await _getCreateDBFacebookCampaignPayload(options)
      );
      return savedCampaign.id;
    } catch (error: any) {
      console.log("Error Facebook Create Campaign", error);
      return next(await $firestormErrorHandler(error));
    }
  },
  updateCampaign: async function (
    options: IDBUpdateFacebookCampaignPayload,
    next: NextFunction
  ) {
    try {
      const { campaignId, updateData } = options;
      const updatedFacebookDBCampaign = await FACEBOOK_CAMPAIGNS_DB.doc(
        campaignId
      ).update(
        await _getupdateDBFacebookCampaignPayload({
          updateData,
        })
      );
      return updatedFacebookDBCampaign;
    } catch (error: any) {
      console.log("Error Facebook Update Campaign", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  saveCampaignObjective: async function (req: Request, next: NextFunction) {
    try {
      const { saveCampaignObject, organizationId } = req.body;
      const { campaignData, pageId, platform } = saveCampaignObject;
      const {
        facebookObjectiveValues,
        facebookObjectiveIdentifier,
        ...facebookCampaignData
      } = campaignData;
      // We always start with creating a campaign because an objective is the first thing we do
      const createdFacebookCampaigns = await _createMultipleFacebookCampaigns(
        {
          facebookObjectiveValues,
          facebookCampaignData,
        },
        next
      );
      const createCampaignPayload: IDBFacebookCampaign = {
        facebookCampaigns: (
          createdFacebookCampaigns as ICreateMultipleCampaignsResponse
        ).campaigns,

        facebookObjectiveIdentifier,
        facebookPage: pageId,
        platform,
        facebookAdAccount: (
          createdFacebookCampaigns as ICreateMultipleCampaignsResponse
        ).facebookAdAccount,
        organizationPathId: `organizations/${organizationId}`,
      };
      return await this.createCampaign(createCampaignPayload, next);
    } catch (error: any) {
      console.log("Error Facebook/DB Save Objective", error);
      return next(error);
    }
  },
  updateCampaignObjective: async function (req: Request, next: NextFunction) {
    try {
      const { saveCampaignObject, savedDBFacebookCampaign } = req.body;
      let { facebookCampaigns, facebookAdAccount } =
        savedDBFacebookCampaign as IDBFacebookCampaign;
      const { campaignId, campaignData } =
        saveCampaignObject as ISaveFacebookCampaignObject;
      const {
        facebookObjectiveIdentifier,
        facebookObjectiveValues,
        ...facebookCampaignData
      } = campaignData;
      // Is the new or saved campaign citch_reach
      const isNewCampaignCitchReach =
        campaignData.facebookObjectiveIdentifier ===
        EFacebookObjectiveIdentifier.citch_reach;
      const isSavedCampaignCitchReach =
        savedDBFacebookCampaign.facebookObjectiveIdentifier ===
        EFacebookObjectiveIdentifier.citch_reach;
      // if citch_reach then we delete the saved one and just create a new one on facebook but update the DB
      // It can also be generic and look for multiple values instead of just citch_reach
      if (isNewCampaignCitchReach || isSavedCampaignCitchReach) {
        await _deleteMultipleFacebookCampaigns(
          { facebookCampaigns: facebookCampaigns as string[] },
          next
        );
        const createdFacebookCampaigns =
          (await _createMultipleFacebookCampaigns(
            {
              facebookObjectiveValues:
                facebookObjectiveValues as EFacebookObjectiveValue[],
              facebookCampaignData,
            },
            next
          )) as ICreateMultipleCampaignsResponse;
        // overwrite existing local values for these values which came back from DB
        facebookCampaigns = createdFacebookCampaigns.campaigns;
        facebookAdAccount = createdFacebookCampaigns.facebookAdAccount;
      } else {
        // at this point you would only be updating a campaign with only one objective and a DB Facebook Campaign with with saved id
        const updateFacebookCampaignPayload: IUpdateFacebookCampaignPayload = {
          savedFacebookCampaignId: (facebookCampaigns as string[])[0],
          updateContent: {
            objective: (
              facebookObjectiveValues as EFacebookObjectiveValue[]
            )[0],
            ...facebookCampaignData,
          },
        };
        await _updateFacebookCampaign(updateFacebookCampaignPayload, next);
      }
      const updateDBCampaignPayload: IDBUpdateFacebookCampaignPayload = {
        campaignId: campaignId as string, // we use the passed campaignId here because it is the same we used to get the saved one, so it wouldnt make a difference
        updateData: {
          facebookCampaigns: facebookCampaigns,
          facebookObjectiveIdentifier,
          facebookAdAccount: facebookAdAccount,
        } as IDBFacebookCampaign,
      };
      return await this.updateCampaign(updateDBCampaignPayload, next);
    } catch (error: any) {
      console.log("Error Facebook/DB Update Objective", error);
      return next(error);
    }
  },
};
