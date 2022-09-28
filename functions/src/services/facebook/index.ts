// helpers
import { $facebookErrorHandler } from '../../utils/error-handler';
import { getRandomHash } from '../../utils/auth-state-hash-creator';
// 3rd party
import { stringify } from 'query-string';
// types
import { NextFunction, Request } from 'express';

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
      return `https://www.facebook.com/${process.env.FACEBOOK_API_VERSION}/dialog/oauth?${stringifiedParams}`;
    } catch (error: any) {
      return next(await $facebookErrorHandler(error));
    }
  },
};
