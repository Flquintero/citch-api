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
    const { postId, adAccount, platform, instagramAccount, facebookPage } =
      options;

    const isFacebook = platform === "facebook";
    const isInstagram = platform === "instagram";

    const facebookCreativeData = {
      object_story_id: postId,
    };

    const instagramCreativeData = {
      object_id: facebookPage,
      instagram_user_id: instagramAccount,
      source_instagram_media_id: postId,
      // define what we will do with this field for carousels as it gives error when they dont have ctas
      // call_to_action:
      //   "{'type':'LEARN_MORE','value':{'link': 'https://www.instagram.com/droneskyvisuals/'}}",
    };

    const adCreativeBody = {
      name: `${postId}-creative`,
      ...(isFacebook ? { ...facebookCreativeData } : null),
      ...(isInstagram ? { ...instagramCreativeData } : null),
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
