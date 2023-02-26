import { $apiRequest } from "../../../../utils/https-call";
import { $facebookErrorHandler } from "../../../../utils/error-handler";
import { _getTargetedInterestsObject } from "../adset-helpers/facebook-adset-interests-helper";
import { _getTargetedLocationObject } from "../adset-helpers/facebook-adset-location-helper";
import { _getTargetedGenderEnum } from "../adset-helpers/facebook-adset-gender-helper";
import { _getTargetedPlacementObject } from "../adset-helpers/facebook-adset-placement-helper";
// types
import { NextFunction } from "express";
import { EFacebookAdSetBillingEvent } from "../../../../types/modules/facebook/campaigns/enums";
import type { IFacebookLocation } from "../../../../types/modules/facebook/campaigns/interfaces";

// constants;
import {
  FACEBOOK_GRAPH_URL,
  FACEBOOK_API_VERSION,
  FACEBOOK_SYSTEM_USER_TOKEN,
} from "../facebook-constants";

// 3rd
import * as dayjs from "dayjs";

export async function _createMultipleFacebookAdSets(
  options: { adSetPayloadArray: any[] },
  next: NextFunction
): Promise<boolean[] | void> {
  try {
    const { adSetPayloadArray } = options;
    return (await Promise.all(
      adSetPayloadArray.map(async (adSetPayload: any) => {
        console.log("adSetPayload", adSetPayload);
        return await _createFacebookAdSet(adSetPayload, next);
      })
    )) as any[];
  } catch (error: any) {
    console.log("Error Facebook Creating Multiple Ad Sets", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _createFacebookAdSet(options: any, next: NextFunction) {
  try {
    const {
      campaignId,
      adAccount,
      platform,
      objective,
      pageId,
      status,
      audience,
    } = options;

    const { ageMin, ageMax, gender, chosenLocations, chosenInterests } =
      audience;

    const adsetBody = {
      name: `${platform.toUpperCase()}-${campaignId}-ADSET-${objective}`,
      optimization_goal: objective,
      billing_event: EFacebookAdSetBillingEvent.impressions, // ask ernesto to see if this needs to be dynamic
      campaign_id: campaignId,
      promoted_object: {
        page_id: pageId,
      },
      status: status,
      targeting: {
        // Locations
        ...(await _getTargetedLocationObject(
          chosenLocations as IFacebookLocation[]
        )),
        // Interests
        ...(chosenInterests
          ? await _getTargetedInterestsObject(chosenInterests)
          : null),
        // Gender
        ...(await _getTargetedGenderEnum(gender as string)),
        // Age
        age_min: parseInt(ageMin as string),
        age_max: parseInt(ageMax as string),
        // ...(await _getTargetedPlacementObject(platform, placement)), IMPORTANT MAYBE WE DONT NEED
      },
      start_time: dayjs().unix(), // SET hardcoded here because these are placeholders to be updated by user in later steps
      end_time: dayjs().add(2, "M").unix(), // SET hardcoded here because these are placeholders to be updated by user in later steps
    };
    return await $apiRequest({
      method: "POST",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/act_${adAccount}/adsets`,
      data: { ...adsetBody, access_token: FACEBOOK_SYSTEM_USER_TOKEN },
    });
  } catch (error: any) {
    console.log("Error Facebook Save Adset", error);
    return next(await $facebookErrorHandler(error));
  }
}
