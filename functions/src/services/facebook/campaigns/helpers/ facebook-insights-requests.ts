// helpers
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

export async function _getFacebookAdInsights(
  options: { adId: string; fields: string; date_preset: string },
  next: NextFunction
) {
  try {
    const { adId, fields, date_preset } = options;
    const stringifiedParams = await $stringifyParams({
      date_preset,
      fields,
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${adId}/insights?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Facebook Post Insights", error);
    return next(await $facebookErrorHandler(error));
  }
}
