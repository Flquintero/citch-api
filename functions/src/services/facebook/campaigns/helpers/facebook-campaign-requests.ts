// helpers
import { $apiRequest } from "../../../../utils/https-call";
import { $facebookErrorHandler } from "../../../../utils/error-handler";
import { _chooseFromAvailableAdAccounts } from "../../helpers/generic";
import { $stringifyParams } from "../../../../utils/stringify-params";
import {
  EFacebookCampaignStatus,
  EFacebookCampaignPlaceholder,
  EFacebookCampaignBidStrategy,
  EFacebookCampaignBuyingType,
} from "../../../../types/modules/facebook/campaigns/enums";

// types
import { NextFunction } from "express";
import {
  IFacebookCampaignData,
  IUpdateFacebookCampaignPayload,
  ICreateCampaignResponse,
  ICreateMultipleCampaignsResponse,
} from "../../../../types/modules/facebook/campaigns/interfaces";
import { EFacebookObjectiveValue } from "../../../../types/modules/facebook/campaigns/enums";

// constants
import {
  FACEBOOK_GRAPH_URL,
  FACEBOOK_API_VERSION,
  FACEBOOK_SYSTEM_USER_TOKEN,
} from "../../helpers/facebook-constants";

// To Do: Maybe do batch requests?
export async function _createMultipleFacebookCampaigns(
  options: {
    facebookObjectiveValues: EFacebookObjectiveValue[];
    facebookCampaignData: IFacebookCampaignData;
  },
  next: NextFunction
): Promise<ICreateMultipleCampaignsResponse | void> {
  try {
    const { facebookObjectiveValues, facebookCampaignData } = options;
    let multipleCampaignResponse: ICreateMultipleCampaignsResponse = {
      campaigns: [],
      facebookAdAccount: await _chooseFromAvailableAdAccounts(),
    };
    const createCampaignsArray = await Promise.all(
      facebookObjectiveValues.map(
        async (facebookObjectiveValue: EFacebookObjectiveValue) => {
          facebookCampaignData.objective = facebookObjectiveValue;
          const savedFacebookCampaignObject = (await _createFacebookCampaign(
            {
              facebookCampaignData,
              facebookAdAccount: multipleCampaignResponse.facebookAdAccount,
            },
            next
          )) as ICreateCampaignResponse;
          return savedFacebookCampaignObject.campaign.id;
        }
      )
    );
    multipleCampaignResponse.campaigns = createCampaignsArray as string[];
    return multipleCampaignResponse;
  } catch (error: any) {
    console.log("Error Facebook  Multiple Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _createFacebookCampaign(
  options: {
    facebookCampaignData: IFacebookCampaignData;
    facebookAdAccount?: string;
  },
  next: NextFunction
): Promise<ICreateCampaignResponse | void> {
  try {
    const { facebookCampaignData, facebookAdAccount } = options;
    // We need to reuse ad account if using citch_reach to save both campaigns in same place
    const currentFacebookAdAccount = facebookAdAccount
      ? facebookAdAccount
      : await _chooseFromAvailableAdAccounts();
    const campaign = await $apiRequest({
      method: "post",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/act_${currentFacebookAdAccount}/campaigns`,
      data: {
        ...facebookCampaignData, // needs to match all the user generated params that facebook takes see https://developers.facebook.com/docs/marketing-apis/get-started
        status: EFacebookCampaignStatus.paused,
        special_ad_categories: [],
        access_token: FACEBOOK_SYSTEM_USER_TOKEN,
        lifetime_budget: EFacebookCampaignPlaceholder.budget,
        bid_strategy: EFacebookCampaignBidStrategy.lowCostWithoutCap,
        buying_type: EFacebookCampaignBuyingType.auction,
      },
    });
    return {
      facebookAdAccount: currentFacebookAdAccount,
      campaign,
    };
  } catch (error: any) {
    console.log("Error Facebook Create Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}

// not being used for now as update only happens if there is only one objective so only one campaign
// export async function _updateMultipleFacebookCampaigns(
//   options: { campaignData: any; facebookCampaigns: string[] },
//   next: NextFunction
// ): Promise<boolean[] | void> {
//   try {
//     const { campaignData, facebookCampaigns } = options;
//     campaignData.objective = campaignData.facebookObjectiveValues[0]; //because at this point we are only updating to another objective that only has 1 value in array;
//     await Promise.all(
//       facebookCampaigns.map(async (savedFacebookCampaignId: string) => {
//         campaignData.savedFacebookCampaignId = savedFacebookCampaignId;
//         await _updateFacebookCampaign({ campaignData }, next);
//       })
//     );
//   } catch (error: any) {
//     console.log('Error Facebook Update Multiple Campaign', error);
//     return next(await $facebookErrorHandler(error));
//   }
// }

export async function _getFacebookCampaign(
  options: { campaignId: string; targetFields: string },
  next: NextFunction
): Promise<any | void> {
  try {
    const { campaignId, targetFields } = options;
    const stringifiedParams = await $stringifyParams({
      fields: targetFields,
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${campaignId}?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Facebook Get Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _updateFacebookCampaign(
  updateFacebookCampaignPayload: IUpdateFacebookCampaignPayload,
  next: NextFunction
): Promise<any | void> {
  try {
    const { savedFacebookCampaignId, updateContent } =
      updateFacebookCampaignPayload;
    return await $apiRequest({
      method: "post",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${savedFacebookCampaignId}`,
      data: {
        access_token: FACEBOOK_SYSTEM_USER_TOKEN,
        ...updateContent, // needs to match all the user generated params that facebook takes see https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group#Updating
      },
    });
  } catch (error: any) {
    console.log("Error Facebook Update Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _deleteFacebookCampaign(
  options: { campaignId: string },
  next: NextFunction
): Promise<boolean | void> {
  try {
    const { campaignId } = options;
    return await $apiRequest({
      method: "delete",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${campaignId}`,
      data: {
        access_token: FACEBOOK_SYSTEM_USER_TOKEN,
      },
    });
  } catch (error: any) {
    console.log("Error Facebook Delete Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _getMultipleFacebookCampaigns(
  options: { facebookCampaignIds: string[]; targetFields: string },
  next: NextFunction
): Promise<boolean[] | void> {
  try {
    const { facebookCampaignIds, targetFields } = options;
    return await Promise.all(
      facebookCampaignIds.map(async (campaignId: string) => {
        return (await _getFacebookCampaign(
          { campaignId, targetFields },
          next
        )) as boolean;
      })
    );
  } catch (error: any) {
    console.log("Error Facebook Delete Multiple Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _deleteMultipleFacebookCampaigns(
  options: { facebookCampaigns: string[] },
  next: NextFunction
): Promise<boolean[] | void> {
  try {
    const { facebookCampaigns } = options;
    return await Promise.all(
      facebookCampaigns.map(async (campaignId: string) => {
        return (await _deleteFacebookCampaign({ campaignId }, next)) as boolean;
      })
    );
  } catch (error: any) {
    console.log("Error Facebook Delete Multiple Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _getFacebookCampaignEdge(
  options: { campaignId: string; targetEdge: string; targetFields: string },
  next: NextFunction
): Promise<any | void> {
  try {
    const { campaignId, targetEdge, targetFields } = options;
    const stringifiedParams = await $stringifyParams({
      fields: targetFields,
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${campaignId}/${targetEdge}?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Facebook Get Campaign", error);
    return next(await $facebookErrorHandler(error));
  }
}
