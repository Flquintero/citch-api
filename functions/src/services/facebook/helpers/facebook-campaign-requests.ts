// helpers
import { $apiRequest } from '../../../utils/https-call';
import { $facebookErrorHandler } from '../../../utils/error-handler';
import { _chooseFromAvailableAdAccounts } from '../helpers/generic';

// types
import { NextFunction } from 'express';
import {
  IFacebookCampaignData,
  ICreateCampaignResponse,
  EFacebookObjectiveValue,
} from '../../../types/modules/facebook';

// constants
import { FACEBOOK_GRAPH_URL, FACEBOOK_API_VERSION, FACEBOOK_SYSTEM_USER_TOKEN } from './facebook-constants';

// To Do: Maybe do batch requests?
export async function _createMultipleFacebookCampaigns(
  options: { facebookObjectiveValues: EFacebookObjectiveValue[]; facebookCampaignData: IFacebookCampaignData },
  next: NextFunction
): Promise<string[]> {
  const { facebookObjectiveValues, facebookCampaignData } = options;
  const createCampaignsArray = await Promise.all(
    facebookObjectiveValues.map(async (facebookObjectiveValue: EFacebookObjectiveValue) => {
      facebookCampaignData.objective = facebookObjectiveValue;
      const savedFacebookCampaignObject = await _createFacebookCampaign({ facebookCampaignData }, next);
      facebookCampaignData.facebookAdAccount = (
        savedFacebookCampaignObject as ICreateCampaignResponse
      ).facebookAdAccount;
      return (savedFacebookCampaignObject as ICreateCampaignResponse).campaign.id;
    })
  );
  return createCampaignsArray as string[];
}

export async function _createFacebookCampaign(
  options: { facebookCampaignData: IFacebookCampaignData },
  next: NextFunction
): Promise<ICreateCampaignResponse | void> {
  try {
    const { facebookCampaignData } = options;
    const { facebookAdAccount } = facebookCampaignData; // saved Ad account from first campaign i.e citch_reach
    // We need to reuse ad account if using citch_reach to save both campaigns in same place
    console.log('facebookCampaignData', facebookCampaignData.objective);
    console.log('facebookAdAccount', facebookAdAccount);
    const currentFacebookAdAccount = facebookAdAccount ? facebookAdAccount : await _chooseFromAvailableAdAccounts();
    const campaign = await $apiRequest({
      method: 'post',
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/act_${currentFacebookAdAccount}/campaigns`,
      data: {
        ...facebookCampaignData, // needs to match all the user generated params that facebook takes see https://developers.facebook.com/docs/marketing-apis/get-started
        status: 'PAUSED',
        special_ad_categories: [],
        access_token: FACEBOOK_SYSTEM_USER_TOKEN,
      },
    });
    return {
      facebookAdAccount: currentFacebookAdAccount,
      campaign,
    };
  } catch (error: any) {
    console.log('Error Facebook Create Campaign', error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _updateFacebookCampaign(options: { campaignData: IFacebookCampaignData }, next: NextFunction) {
  try {
    const { campaignData } = options;
    const {
      campaignId,
      savedFacebookCampaignId,
      facebookObjectiveIdentifier,
      facebookObjectiveValues,
      ...updateContent
    } = campaignData;
    return await $apiRequest({
      method: 'post',
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${savedFacebookCampaignId}`,
      data: {
        access_token: FACEBOOK_SYSTEM_USER_TOKEN,
        ...updateContent, // needs to match all the user generated params that facebook takes see https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group#Updating
      },
    });
  } catch (error: any) {
    console.log('Error Facebook Update Campaign', error);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _deleteFacebookCampaign(options: { campaignId: string }, next: NextFunction) {
  try {
    const { campaignId } = options;
    return await $apiRequest({
      method: 'delete',
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${campaignId}`,
      data: {
        access_token: FACEBOOK_SYSTEM_USER_TOKEN,
      },
    });
  } catch (error: any) {
    console.log('Error Facebook Delete Campaign', error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _deleteMultipleFacebookCampaigns(
  options: { facebookCampaigns: string[] },
  next: NextFunction
): Promise<boolean[]> {
  const { facebookCampaigns } = options;
  return await Promise.all(
    facebookCampaigns.map(async (campaignId: string) => {
      return await _deleteFacebookCampaign({ campaignId }, next);
    })
  );
}
