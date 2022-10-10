// helpers
import { $apiRequest } from '../../../utils/https-call';
import { $facebookErrorHandler } from '../../../utils/error-handler';
import { $stringifyParams } from '../../../utils/stringify-params';

// types
import { NextFunction } from 'express';

//constants
import { FACEBOOK_GRAPH_URL, FACEBOOK_API_VERSION } from './facebook-constants';

export async function _authUserData(code: string, next: NextFunction) {
  try {
    const stringifiedParams = await $stringifyParams({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      code,
      redirect_uri: `${process.env.REDIRECT_URI}/facebook`,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/oauth/access_token?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log('Error Facebook Auth User Data', error);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _appAccessToken(next: NextFunction) {
  try {
    const stringifiedParams = await $stringifyParams({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      grant_type: 'client_credentials',
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/oauth/access_token?${stringifiedParams}`,
    });
  } catch (error: any) {
    return next(await $facebookErrorHandler(error));
  }
}
export async function _longLivedUserAccessToken(userAccessToken: string, next: NextFunction) {
  try {
    const stringifiedParams = await $stringifyParams({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      grant_type: 'fb_exchange_token',
      fb_exchange_token: userAccessToken,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/oauth/access_token?${stringifiedParams}`,
    });
  } catch (error: any) {
    return next(await $facebookErrorHandler(error));
  }
}
export async function _userAccessToken(
  userLongLivedAccessToken: string,
  appAccessToken: string,
  next: NextFunction
) {
  try {
    const stringifiedParams = await $stringifyParams({
      input_token: userLongLivedAccessToken,
      access_token: appAccessToken,
    });
    const userAccessTokenData = await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/debug_token?${stringifiedParams}`,
    });
    return userAccessTokenData.data; // yes it has 2 data objects;
  } catch (error: any) {
    return next(await $facebookErrorHandler(error));
  }
}
