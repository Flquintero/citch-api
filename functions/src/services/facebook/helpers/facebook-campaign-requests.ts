// helpers
import { $apiRequest } from '../../../utils/https-call';
import { $facebookErrorHandler } from '../../../utils/error-handler';
import { _chooseFromAvailableAdAccounts } from '../helpers/generic';

// types
import { NextFunction } from 'express';
import { IFacebookCampaignData } from '../../../types/modules/facebook';

// constants
import { FACEBOOK_GRAPH_URL, FACEBOOK_API_VERSION, FACEBOOK_SYSTEM_USER_TOKEN } from './facebook-constants';

export async function _createFacebookCampaign(
  options: { facebookCampaignData: IFacebookCampaignData },
  next: NextFunction
) {
  try {
    const { facebookCampaignData } = options;
    return await $apiRequest({
      method: 'post',
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/act_${await _chooseFromAvailableAdAccounts()}/campaigns`,
      data: {
        ...facebookCampaignData, // needs to match all the user generated params that facebook takes see https://developers.facebook.com/docs/marketing-apis/get-started
        status: 'PAUSED',
        special_ad_categories: [],
        access_token: FACEBOOK_SYSTEM_USER_TOKEN,
      },
    });
  } catch (error: any) {
    console.log('Error Facebook Create Campaign', error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _updateFacebookCampaign(options: { campaignData: IFacebookCampaignData }, next: NextFunction) {
  try {
    const { campaignData } = options;
    const { campaignId, ...updateContent } = campaignData;
    return await $apiRequest({
      method: 'post',
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${campaignId}`,
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
