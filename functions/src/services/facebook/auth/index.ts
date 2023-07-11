// services
import organizationsService from "../../../services/organizations";

// Helpers
import { $facebookErrorHandler } from "../../../utils/error-handler";
import { $getRandomHash } from "../../../utils/auth-state-hash-creator";
import { $stringifyParams } from "../../../utils/stringify-params";

// Local Helpers
import {
  _authUserData,
  _appAccessToken,
  _longLivedUserAccessToken,
  _userAccessToken,
} from "./helpers/facebook-user-auth-handler";

// Types
import { NextFunction, Request } from "express";
import { EFacebookConnectionStatus } from "../../../types/modules/facebook/auth/enums";

// Constants
import { FACEBOOK_URL } from "../helpers/facebook-constants";

export const auth = {
  getFacebookConsentUrl: async function (options: Request, next: NextFunction) {
    try {
      const state = $getRandomHash();
      const stringifiedParams = await $stringifyParams({
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri: `${process.env.REDIRECT_URI}/facebook`,
        scope: [
          "email",
          "ads_management",
          "ads_read",
          "business_management",
          "pages_read_engagement",
          "instagram_basic",
          "pages_manage_ads",
          "public_profile",
          "pages_show_list",
          "pages_manage_metadata", // need to ask for it in review
        ].join(","), // comma seperated string
        response_type: "code",
        auth_type: "rerequest",
        state,
      });
      return {
        url: `${FACEBOOK_URL}/${process.env.FACEBOOK_API_VERSION}/dialog/oauth?${stringifiedParams}`,
        state,
      };
    } catch (error: any) {
      return next(await $facebookErrorHandler(error));
    }
  },
  getUserAuthData: async function (code: string, next: NextFunction) {
    if (code) {
      try {
        // user data that facebook returns with a short lived token
        const userAuthData = await _authUserData(code, next);
        // app access token - available in the app dashboard but need to get it dinamically in case it is expired
        const appAccessTokenData = await _appAccessToken(next);
        // exchange shortlived token for a long lived one for user
        const longLivedAccessTokenData = await _longLivedUserAccessToken(
          userAuthData.access_token,
          next
        );
        // get all the token data to populate the data we are saving to DB
        const userAccessTokenData = await _userAccessToken(
          longLivedAccessTokenData.access_token,
          appAccessTokenData.access_token,
          next
        );
        // to be saved in organizations collections in DB
        return {
          facebookData: {
            access_token: longLivedAccessTokenData.access_token,
            token_type: longLivedAccessTokenData.token_type,
            data_access_expires_at: userAccessTokenData.data_access_expires_at,
            expires_at: userAccessTokenData.expires_at,
            user_id: userAccessTokenData.user_id,
            app_id: userAccessTokenData.app_id,
          },
        };
      } catch (error: any) {
        return next(error);
      }
    } else {
      return new Error("Error Connecting to Platform");
    }
  },
  checkUserAuthToken: async function (req: Request, next: NextFunction) {
    // FACEBOOOK doesnt have refresh tokens, if you use the api it refreshes for you so if it expires we need a new one
    try {
      const { organizationId, organization } = req.body;
      if (!organization.facebookData || organization.facebookData === null) {
        return { status: EFacebookConnectionStatus.disconnected };
      } else {
        const appAccessTokenData = await _appAccessToken(next);
        const userAccessTokenData = await _userAccessToken(
          organization.facebookData.access_token,
          appAccessTokenData.access_token,
          next
        );
        if (userAccessTokenData.is_valid) {
          return { status: EFacebookConnectionStatus.connected };
          // maybe the below should be decoupled but i feel its part of the functionality that if its invalid cut the bs and make them reconnect
        } else {
          const updateObject = {
            pathId: `organizations/${organizationId}`,
            updateData: { facebookData: null },
          };
          await organizationsService.update(updateObject, next);
          return {
            status: EFacebookConnectionStatus.expired,
            message: "Token has expired. Please Reconnect Again",
          };
        }
      }
    } catch (error: any) {
      return next(error);
    }
  },
};
