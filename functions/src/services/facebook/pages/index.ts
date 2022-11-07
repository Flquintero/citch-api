// Helpers
import { $facebookErrorHandler } from '../../../utils/error-handler';

// Local Helpers
import {
  _getFacebookPage,
  _checkPageLinkedToAppBusinessManager,
  _connectUserPageToAppBusinessManager,
  _connectSystemUserToUserPage,
  _checkSystemUserConnectedToUserPage,
  _getUserPages,
} from './helpers/facebook-page-requests';
import { _getFacebookPost } from './helpers/facebook-post-requests';

// Types
import { NextFunction, Request } from 'express';
import { IFacebookPage } from '../../../types/modules/facebook/pages/interfaces';
import { EFacebookPageLinkedStatus, EFacebookPageLinkedMessage } from '../../../types/modules/facebook/pages/enums';

// Constants
import { FACEBOOK_APP_PAGE_ID } from '../helpers/facebook-constants';

export const pages = {
  linkUserAccounts: async function (req: Request, next: NextFunction) {
    try {
      const { facebookPageData } = req.body;
      const pageId = facebookPageData.id;
      const { access_token } = req.body.organization.facebookData;

      // Allow Citch page through, it doesnt list it in options
      if (pageId === FACEBOOK_APP_PAGE_ID) {
        return EFacebookPageLinkedMessage.already_linked;
      }
      // End of Citch hack

      const pageConnectData = {
        pageId,
        page_access_token: (facebookPageData as IFacebookPage).access_token as string,
      };
      const pageLinkedObject = await _checkPageLinkedToAppBusinessManager(pageConnectData, next);
      if (pageLinkedObject?.status === EFacebookPageLinkedStatus.not_linked) {
        await _connectUserPageToAppBusinessManager({ user_access_token: access_token, pageId }, next);

        //CONNECT SYSTEM USER TO PAGE BECAUSE IF WE NEED TO CONNECT TO BIZ MANAGER MEANS PAGE NOT CONNECTED
        await _connectSystemUserToUserPage({ pageId }, next);
        return EFacebookPageLinkedMessage.link_success;
      } else {
        //CHECK TO SEE IF SYSTEM USER HAS PAGE IF NOT CONNECT IT (IT SHOULD BE BECAUSE OF THE ABOVE PROCESS)
        const systemUserConnected = await _checkSystemUserConnectedToUserPage({ pageId }, next);
        console.log('systemUserConnected', systemUserConnected);
        if (systemUserConnected?.status === EFacebookPageLinkedStatus.not_linked) {
          await _connectSystemUserToUserPage({ pageId }, next);
        }
        return EFacebookPageLinkedMessage.already_linked;
      }
    } catch (error: any) {
      console.log('Error Facebook Linking Accounts', error.data);
      return next(await $facebookErrorHandler(error));
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
      return await _getUserPages({ userId: user_id, access_token, fields: `id,name,picture` }, next);
    } catch (error: any) {
      console.log('Error Facebook Get User Pages', error);
      return next(await $facebookErrorHandler(error));
    }
  },
};
