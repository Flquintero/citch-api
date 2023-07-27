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
} from "../../helpers/facebook-constants";

export async function _getUserInstagramPosts(
  options: { instagramAccountId: string; access_token: string; fields: string },
  next: NextFunction
) {
  try {
    const { instagramAccountId, access_token, fields } = options;
    const stringifiedParams = await $stringifyParams({
      fields,
      access_token,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${instagramAccountId}/media?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Instagram Get Posts", error);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _getInstagramPost() {
  return;
}
