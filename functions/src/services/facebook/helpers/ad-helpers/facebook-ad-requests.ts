import { $apiRequest } from "../../../../utils/https-call";
import { $facebookErrorHandler } from "../../../../utils/error-handler";

// types
import { NextFunction } from "express";

// constants;
import {
  FACEBOOK_GRAPH_URL,
  FACEBOOK_API_VERSION,
  FACEBOOK_SYSTEM_USER_TOKEN,
} from "../facebook-constants";

export async function _createMultipleFacebookAds(
  options: {
    adSets: any[];
    adCreative: string;
    adAccount: string;
    status: string;
  },
  next: NextFunction
): Promise<boolean[] | void> {
  try {
    const { adSets, adCreative, adAccount, status } = options;
    return (await Promise.all(
      adSets.map(async (adSet: { id: string }) => {
        return await _createFacebookAds(
          { adSet: adSet.id, adCreative, adAccount, status },
          next
        );
      })
    )) as any[];
  } catch (error: any) {
    console.log("Error Facebook Creating Multiple Ads", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _createFacebookAds(options: any, next: NextFunction) {
  try {
    const { adSet, adCreative, adAccount, status } = options;

    const adBody = {
      name: `${adSet}-ad`,
      adset_id: adSet,
      creative: {
        creative_id: adCreative,
      },
      status: status,
    };

    const ad = await $apiRequest({
      method: "POST",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/act_${adAccount}/ads`,
      data: { ...adBody, access_token: FACEBOOK_SYSTEM_USER_TOKEN },
    });
    return ad.id;
  } catch (error: any) {
    console.log("Error Facebook Save Ad", error);
    return next(await $facebookErrorHandler(error));
  }
}
