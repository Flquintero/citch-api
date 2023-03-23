import { $apiRequest } from "../../../../utils/https-call";
import { $facebookErrorHandler } from "../../../../utils/error-handler";
import { $stringifyParams } from "../../../../utils/stringify-params";

// types
import { NextFunction } from "express";

// constants
import {
  FACEBOOK_GRAPH_URL,
  FACEBOOK_API_VERSION,
  FACEBOOK_SYSTEM_USER_TOKEN,
} from "../../helpers/facebook-constants";

export async function _getFacebookLocations(
  options: {
    locationSearchString: string;
    fields?: string;
    locationTypes: string; // `["country", "region", "city", "zip"]`
  },
  next: NextFunction
) {
  try {
    const { locationSearchString, fields, locationTypes } = options;
    const stringifiedParams = await $stringifyParams({
      ...(fields ? { fields } : null),
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
      q: locationSearchString,
      type: "adgeolocation",
      location_types: locationTypes,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/search?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Facebook Get Locations", error);
    return next(await $facebookErrorHandler(error));
  }
}

export async function _getFacebookInterests(
  options: {
    interestSearchString: string;
    fields?: string;
  },
  next: NextFunction
) {
  try {
    const { interestSearchString, fields } = options;
    const stringifiedParams = await $stringifyParams({
      ...(fields ? { fields } : null),
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
      q: interestSearchString,
      type: "adinterest",
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/search?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Facebook Get Locations", error);
    return next(await $facebookErrorHandler(error));
  }
}
