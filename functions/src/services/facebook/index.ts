// helpers
import { $facebookErrorHandler } from '../../utils/error-handler';
import { getRandomHash } from '../../utils/auth-state-hash-creator';
import {
  _authUserData,
  _appAccessToken,
  _longLivedUserAccessToken,
  _userAccessToken,
} from './helpers/facebook-user-auth-handler';
import { _getFacebookPost } from './helpers/facebook-post-requests';
import {
  _getFacebookPage,
  _checkPageLinkedToAppBusinessManager,
  _connectUserPageToAppBusinessManager,
  _connectSystemUserToUserPage,
  _checkSystemUserConnectedToUserPage,
  _getUserPages,
} from './helpers/facebook-page-requests';
import { $stringifyParams } from '../../utils/stringify-params';
// services
import organizationsService from '../../services/organizations';
// types
import { NextFunction, Request } from 'express';
import {
  FacebookConnectionStatus,
  IFacebookPage,
  FacebookPageLinkedStatus,
  FacebookPageLinkedMessage,
} from '../../types/modules/facebook';
// constants
import { FACEBOOK_URL, FACEBOOK_APP_PAGE_ID } from './helpers/facebook-constants';

export default {
  getFacebookConsentUrl: async function (options: Request, next: NextFunction) {
    try {
      const state = getRandomHash();
      const stringifiedParams = await $stringifyParams({
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
      return new Error('Error Connecting to Platform');
    }
  },
  checkUserToken: async function (req: Request, next: NextFunction) {
    // FACEBOOOK doesnt have refresh tokens, if you use the api it refreshes for you so if it expires we need a new one
    try {
      const { organizationId, organization } = req.body;
      if (!organization.facebookData || organization.facebookData === null) {
        return { status: FacebookConnectionStatus.disconnected };
      } else {
        const appAccessTokenData = await _appAccessToken(next);
        const userAccessTokenData = await _userAccessToken(
          organization.facebookData.access_token,
          appAccessTokenData.access_token,
          next
        );
        if (userAccessTokenData.is_valid) {
          return { status: FacebookConnectionStatus.connected };
          // maybe the below should be decoupled but i feel its part of the functionality that if its invalid cut the bs and make them reconnect
        } else {
          const updateObject = {
            pathId: `organizations/${organizationId}`,
            updateData: { facebookData: null },
          };
          await organizationsService.update(updateObject, next);
          return {
            status: FacebookConnectionStatus.expired,
            message: 'Token has expired. Please Reconnect Again',
          };
        }
      }
    } catch (error: any) {
      return next(error);
    }
  },
  getPostPage: async function (req: Request, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { access_token } = req.body.organization.facebookData;
      const postData = await _getFacebookPost({ postId, access_token, fields: `from` }, next);
      return await _getFacebookPage(
        {
          pageId: postData.from.id,
          access_token,
          fields: `id,name,picture`,
        },
        next
      );
    } catch (error: any) {
      console.log('Error Facebook Post Page', error);
      return next(await $facebookErrorHandler(error));
    }
  },
  getUserPages: async function (req: Request, next: NextFunction) {
    try {
      const { access_token, user_id } = req.body.organization.facebookData;
      return await _getUserPages(
        { userId: user_id, access_token, fields: `id,name,picture` },
        next
      );
    } catch (error: any) {
      console.log('Error Facebook Get User Pages', error);
      return next(await $facebookErrorHandler(error));
    }
  },
  linkUserAccounts: async function (req: Request, next: NextFunction) {
    try {
      const { facebookPageData } = req.body;
      const pageId = facebookPageData.id;
      const { access_token } = req.body.organization.facebookData;

      // Allow Citch page through, it doesnt list it in options
      if (pageId === FACEBOOK_APP_PAGE_ID) {
        return FacebookPageLinkedMessage.already_linked;
      }
      // End of Citch hack

      const pageConnectData = {
        pageId,
        page_access_token: (facebookPageData as IFacebookPage).access_token as string,
      };
      const pageLinkedObject = await _checkPageLinkedToAppBusinessManager(pageConnectData, next);
      console.log('pageLinkedObject', pageLinkedObject);
      if (pageLinkedObject?.status === FacebookPageLinkedStatus.not_linked) {
        console.log('NOT LINKED');
        await _connectUserPageToAppBusinessManager(
          { user_access_token: access_token, pageId },
          next
        );

        //CONNECT SYSTEM USER TO PAGE BECAUSE IF WE NEED TO CONNECT TO BIZ MANAGER MEANS PAGE NOT CONNECTED
        await _connectSystemUserToUserPage({ pageId }, next);
        return FacebookPageLinkedMessage.link_success;
      } else {
        console.log('LINKED');
        //CHECK TO SEE IF SYSTEM USER HAS PAGE IF NOT CONNECT IT (IT SHOULD BE BECAUSE OF THE ABOVE PROCESS)
        const systemUserConnected = await _checkSystemUserConnectedToUserPage({ pageId }, next);
        console.log('systemUserConnected', systemUserConnected);
        if (systemUserConnected?.status === FacebookPageLinkedStatus.not_linked) {
          await _connectSystemUserToUserPage({ pageId }, next);
        }
        return FacebookPageLinkedMessage.already_linked;
      }
    } catch (error: any) {
      console.log('Error Facebook Linking Accounts', error.data);
      return next(await $facebookErrorHandler(error));
    }
  },
};
