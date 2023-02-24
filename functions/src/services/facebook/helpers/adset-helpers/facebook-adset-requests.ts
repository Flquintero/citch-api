// import { $apiRequest } from "../../../../utils/https-call";
import { $facebookErrorHandler } from "../../../../utils/error-handler";
// import { $stringifyParams } from "../../../../utils/stringify-params";
import type { IFacebookAudience } from "../../../../types/modules/facebook/campaigns/interfaces";
import { EFacebookObjectiveValue } from "../../../../types/modules/facebook/campaigns/enums";
import { _getTargetedLocationObject } from "../adset-helpers/facebook-adset-location-helper";

// types
import { NextFunction } from "express";

// constants
// import {
//   FACEBOOK_GRAPH_URL,
//   FACEBOOK_API_VERSION,
// } from "../facebook-constants";

export async function _createFacebookAdSet(
  options: {
    campaignId: string;
    adAccount: string;
    platform: string;
    objective: number;
    pageId: string;
    status: string;
    audience: IFacebookAudience;
  },
  next: NextFunction
) {
  try {
    const {
      campaignId,
      //adAccount,
      platform,
      objective,
      pageId,
      status,
      audience,
    } = options;

    const { ageMin, ageMax } = audience;

    // UNCOMMENT BELOW WHEN ALL ARE USED
    // const { ageMin, ageMax, gender, chosenLocations, chosenInterests } =
    // audience;

    const adsetBody = {
      name: `ADSET-${platform.toUpperCase()}-${campaignId}-1`,
      optimization_goal: Object.values(EFacebookObjectiveValue)[objective],
      billing_event: "IMPRESSIONS", // ask ernesto to see if this needs to be dynamic
      campaign_id: campaignId,
      promoted_object: {
        page_id: pageId,
      },
      status: status,
      //USE A REDUCER HERE TO GROUP BY TYPES AND PUSH TO THESE ARRAYS
      targeting: {
        //...(await _getTargetedLocationObject(chosenLocations)),
        //...(await _getTargetedInterestsObject(chosenInterests)), // TO DO - This needs to be optional so add a terniary
        //...(await _getTargetedGenderEnum(gender)), // TO DO
        age_min: parseInt(ageMin as string),
        age_max: parseInt(ageMax as string),
        //...(await _getTargetedPlacementObject(placement)), // TO DO
      },
      //start_time: options.targeting.formattedStartDate, // TO DO
      //end_time: options.targeting.formattedEndDate, // TO DO
    };
    console.log("adSetBody", adsetBody);
    // const { locationSearchString, access_token, fields } = options;
    // const stringifiedParams = await $stringifyParams({
    //   ...(fields ? { fields } : null),
    //   access_token,
    //   q: locationSearchString,
    //   type: "adgeolocation",
    //   location_types: `["country", "region", "city", "zip"]`,
    // });
    // return await $apiRequest({
    //   url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/search?${stringifiedParams}`,
    // });
  } catch (error: any) {
    console.log("Error Facebook Get Locations", error);
    return next(await $facebookErrorHandler(error));
  }
}
