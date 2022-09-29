import { $apiRequest } from '../../../utils/https-call';
import { $axiosErrorHandler } from '../../../utils/error-handler';
import { NextFunction } from 'express';

// 3rd party
import { stringify } from 'query-string';

const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com';

export async function _authUserData(code: string, next: NextFunction) {
  try {
    const stringifiedParams = stringify({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      code,
      redirect_uri: `${process.env.REDIRECT_URI}/facebook`,
    });
    const userAuthData = await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}${process.env.FACEBOOK_API_VERSION}/oauth/access_token?${stringifiedParams}`,
    });
    return userAuthData.data;
  } catch (error: any) {
    next(await $axiosErrorHandler(error));
  }
}
export async function _appAccessToken(next: NextFunction) {
  try {
    const stringifiedParams = stringify({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      grant_type: 'client_credentials',
    });
    const appTokenData = await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}${process.env.FACEBOOK_API_VERSION}/oauth/access_token?${stringifiedParams}`,
    });
    return appTokenData.data;
  } catch (error: any) {
    next(await $axiosErrorHandler(error));
  }
}
export async function _longLivedUserAccessToken(userAccessToken: string, next: NextFunction) {
  try {
    const stringifiedParams = stringify({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      grant_type: 'fb_exchange_token',
      fb_exchange_token: userAccessToken,
    });
    const longLivedUserTokenData = await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}${process.env.FACEBOOK_API_VERSION}/oauth/access_token?${stringifiedParams}`,
    });
    return longLivedUserTokenData.data;
  } catch (error: any) {
    next(await $axiosErrorHandler(error));
  }
}
export async function _userAccessToken(
  userLongLivedAccessToken: string,
  appAccessToken: string,
  next: NextFunction
) {
  try {
    const stringifiedParams = stringify({
      input_token: userLongLivedAccessToken,
      access_token: appAccessToken,
    });
    const userAccessTokenData = await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}${process.env.FACEBOOK_API_VERSION}/debug_token?${stringifiedParams}`,
    });
    return userAccessTokenData.data.data; // yes it has 2 data objects;
  } catch (error: any) {
    next(await $axiosErrorHandler(error));
  }
}
