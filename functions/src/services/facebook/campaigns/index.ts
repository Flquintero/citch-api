// General Helpers
import { $facebookErrorHandler, $firestormErrorHandler } from '../../../utils/error-handler';

// Local Helpers
import {
  _getCreateDBFacebookCampaignPayload,
  _getupdateDBFacebookCampaignPayload,
} from './helpers/campaign-payload-builder';
import {
  _createMultipleFacebookCampaigns,
  _createFacebookCampaign,
  _updateMultipleFacebookCampaigns,
  _updateFacebookCampaign,
  _deleteMultipleFacebookCampaigns,
  _deleteFacebookCampaign,
} from './helpers/facebook-campaign-requests';

// Types
import {
  IDBFacebookCampaign,
  ICreateMultipleCampaignsResponse,
} from '../../../types/modules/facebook/campaigns/interfaces';
import { EFacebookObjectiveIdentifier } from '../../../types/modules/facebook/campaigns/enums';
import { IReadObject } from '../../../types/general/services';
import { NextFunction, Request } from 'express';

// Constants
import { db } from '../../../config/firebase';
const FACEBOOK_CAMPAIGNS_DB = db.collection('facebook_campaigns');

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
  createCampaign: async function (options: IDBFacebookCampaign, next: NextFunction) {
    try {
      const savedCampaign = await FACEBOOK_CAMPAIGNS_DB.add(await _getCreateDBFacebookCampaignPayload(options));
      return savedCampaign.id;
    } catch (error: any) {
      console.log('Error Facebook Create Campaign', error);
      return next(await $firestormErrorHandler(error));
    }
  },
  updateCampaign: async function (req: Request, next: NextFunction) {
    try {
      const { campaignData } = req.body;
      const { campaignId, ...updateData } = campaignData;
      const updatedFacebookDBCampaign = await FACEBOOK_CAMPAIGNS_DB.doc(campaignId).update(
        await _getupdateDBFacebookCampaignPayload({
          updateData,
        })
      );
      return updatedFacebookDBCampaign;
    } catch (error: any) {
      console.log('Error Facebook Update Campaign', error);
      return next(await $facebookErrorHandler(error));
    }
  },
  saveCampaignObjective: async function (req: Request, next: NextFunction) {
    try {
      const { campaignData, organizationId } = req.body;
      const { facebookObjectiveValues, facebookObjectiveIdentifier, ...facebookCampaignData } = campaignData;
      // We always start with creating a campaign because an objective is the first thing we do
      const createdFacebookCampaigns = await _createMultipleFacebookCampaigns(
        {
          facebookObjectiveValues,
          facebookCampaignData,
        },
        next
      );
      const createCampaignPayload: IDBFacebookCampaign = {
        facebookCampaigns: (createdFacebookCampaigns as ICreateMultipleCampaignsResponse).campaigns,
        facebookObjectiveIdentifier,
        facebookAdAccount: facebookCampaignData.facebookAdAccount,
        organizationPathId: `organizations/${organizationId}`,
      };
      return await this.createCampaign(createCampaignPayload, next);
    } catch (error: any) {
      console.log('Error Facebook/DB Save Objective', error);
      return next(error);
    }
  },
  updateCampaignObjective: async function (req: Request, next: NextFunction) {
    try {
      const { campaignData, savedFacebookCampaign } = req.body;
      const { facebookCampaigns } = savedFacebookCampaign;
      const { facebookObjectiveValues, facebookObjectiveIdentifier, ...facebookCampaignData } = campaignData;
      // Is the new or saved campaign citch_reach
      const isNewCampaignCitchReach =
        campaignData.facebookObjectiveIdentifier === EFacebookObjectiveIdentifier.citch_reach;
      const isSavedCampaignCitchReach =
        savedFacebookCampaign.facebookObjectiveIdentifier === EFacebookObjectiveIdentifier.citch_reach;
      // if citch_reach then we delete the saved one and just create a new one on facebook but update the DB
      // It can also be generic and look for multiple values instead of just citch_reach
      if (isNewCampaignCitchReach || isSavedCampaignCitchReach) {
        await _deleteMultipleFacebookCampaigns({ facebookCampaigns }, next);
        const createdFacebookCampaigns = (await _createMultipleFacebookCampaigns(
          {
            facebookObjectiveValues,
            facebookCampaignData,
          },
          next
        )) as ICreateMultipleCampaignsResponse;
        req.body.campaignData.facebookCampaigns = createdFacebookCampaigns.campaigns;
        req.body.campaignData.facebookAdAccount = createdFacebookCampaigns.facebookAdAccount;
      } else {
        await _updateMultipleFacebookCampaigns({ campaignData, facebookCampaigns }, next);
      }
      return await this.updateCampaign(req, next);
    } catch (error: any) {
      console.log('Error Facebook/DB Update Objective', error);
      return next(error);
    }
  },
};
