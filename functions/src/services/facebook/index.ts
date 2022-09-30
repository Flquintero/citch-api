// helpers
import { $facebookErrorHandler } from '../../utils/error-handler';
import { getRandomHash } from '../../utils/auth-state-hash-creator';
import {
  _authUserData,
  _appAccessToken,
  _longLivedUserAccessToken,
  _userAccessToken,
} from './helpers/user-auth-handler';
// 3rd party
import { stringify } from 'query-string';
// types
import { NextFunction, Request } from 'express';
import { IOrganization } from '../../types/services/organizations';

// Declarations

const FACEBOOK_URL = 'https://www.facebook.com';

export default {
  getFacebookConsentUrl: async function (options: Request, next: NextFunction) {
    try {
      const state = getRandomHash();
      const stringifiedParams = stringify({
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri: `${process.env.REDIRECT_URI}/facebook`,
        scope: [
          'email',
          'ads_management',
          'ads_read',
          'business_management',
          'pages_read_engagement',
          'instagram_basic',
          //revoked: 'pages_manage_ads',
          'public_profile',
          'pages_show_list',
        ].join(','), // comma seperated string
        response_type: 'code',
        auth_type: 'rerequest',
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
  getUserData: async function (code: string, next: NextFunction) {
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
            expires_in: longLivedAccessTokenData.expires_in,
            user_id: userAccessTokenData.user_id,
            app_id: userAccessTokenData.app_id,
          },
        };
      } catch (error: any) {
        return next(error);
      }
    } else {
      return new Error('Error Connecting to Platform');
    }
  },
  checkUserToken: async function (organization: IOrganization, next: NextFunction) {
    try {
      if (!organization.facebookData || organization.facebookData === null) {
        return { valid: false };
      } else {
        return { valid: true };
      }
    } catch (error: any) {
      return next(error);
    }
  },
};
