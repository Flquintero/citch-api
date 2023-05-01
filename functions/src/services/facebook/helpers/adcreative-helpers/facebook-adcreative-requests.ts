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

export async function _createFacebookAdCreative(
  options: any,
  next: NextFunction
) {
  try {
    const { postId, adAccount } = options;

    const adCreativeBody = {
      name: `${postId}-creative`,
      object_story_id: postId,
    };
    const adCreativeResponse = await $apiRequest({
      method: "POST",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/act_${adAccount}/adcreatives`,
      data: { ...adCreativeBody, access_token: FACEBOOK_SYSTEM_USER_TOKEN },
    });
    return adCreativeResponse.id;
  } catch (error: any) {
    console.log("Error Facebook Save Adcreative", error);
    return next(await $facebookErrorHandler(error));
  }
}
