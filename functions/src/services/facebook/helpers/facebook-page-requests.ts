// helpers
import { $apiRequest } from '../../../utils/https-call';
import { $facebookErrorHandler } from '../../../utils/error-handler';
import { $stringifyParams } from '../../../utils/stringify-params';

// types
import { NextFunction } from 'express';

//constants
import {
  FACEBOOK_GRAPH_URL,
  FACEBOOK_SYSTEM_USER_ID,
  FACEBOOK_BUSINESS_ID,
  FACEBOOK_SYSTEM_USER_TOKEN,
} from './facebook-constants';

export async function _getFacebookPage(
  options: { pageId: string; access_token: string; fields: string },
  next: NextFunction
) {
  try {
    const { pageId, access_token, fields } = options;

    const stringifiedParams = await $stringifyParams({
      fields,
      access_token,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${process.env.FACEBOOK_API_VERSION}/${pageId}?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log('Error Get Facebook Page', error);
    return next(await $facebookErrorHandler(error));
  }
}
// If connected to our Business Manager
export async function _checkPageLinkedToAppBusinessManager(
  options: { pageId: string; page_access_token: string; pageLimit: number },
  next: NextFunction
) {
  try {
    const linkedPages = await _getLinkedPagesToAppBusinessManager({ pageLimit: 15 }, next);
    console.log('linked pages', linkedPages);
  } catch (error: any) {
    console.log('Error Page Linked to Business Manager', error);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _getLinkedPagesToAppBusinessManager(
  options: { pageLimit: number },
  next: NextFunction
) {
  try {
    const { pageLimit } = options;
    const stringifiedParams = await $stringifyParams({
      summary: 'total_count',
      limit: pageLimit,
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${process.env.FACEBOOK_API_VERSION}/${FACEBOOK_BUSINESS_ID}/client_pages?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log('Error Get Linked Pages to Business Manager', error);
    return next(await $facebookErrorHandler(error));
  }
}
