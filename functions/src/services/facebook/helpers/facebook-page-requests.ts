import { $apiRequest } from '../../../utils/https-call';
import { $facebookErrorHandler } from '../../../utils/error-handler';
import { NextFunction } from 'express';

// 3rd party
import { stringify } from 'query-string';
//constants
import { FACEBOOK_GRAPH_URL } from './facebook-url-constants';

export async function _getFacebookPage(
  options: { pageId: string; access_token: string; fields: string },
  next: NextFunction
) {
  try {
    const { pageId, access_token, fields } = options;
    const stringifiedParams = stringify({
      fields,
      access_token,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${process.env.FACEBOOK_API_VERSION}/${pageId}?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log('Error Facebook Auth User Data', error);
    return next(await $facebookErrorHandler(error));
  }
}
