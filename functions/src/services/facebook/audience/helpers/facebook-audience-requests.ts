import { $apiRequest } from "../../../../utils/https-call";
import { $facebookErrorHandler } from "../../../../utils/error-handler";
import { $stringifyParams } from "../../../../utils/stringify-params";

// types
import { NextFunction } from "express";

// constants
import {
  FACEBOOK_GRAPH_URL,
  FACEBOOK_API_VERSION,
} from "../../helpers/facebook-constants";

export async function _getFacebookLocations(
  options: {
    locationSearchString: string;
    access_token: string;
    fields?: string;
  },
  next: NextFunction
) {
  try {
    const { locationSearchString, access_token, fields } = options;
    const stringifiedParams = await $stringifyParams({
      ...(fields ? { fields } : null),
      access_token,
      q: locationSearchString,
      type: "adgeolocation",
      location_types: `["country", "region", "city", "zip"]`,
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
    access_token: string;
    fields?: string;
  },
  next: NextFunction
) {
  try {
    const { interestSearchString, access_token, fields } = options;
    const stringifiedParams = await $stringifyParams({
      ...(fields ? { fields } : null),
      access_token,
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
