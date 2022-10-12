// helpers
import { $apiRequest } from '../../../utils/https-call';
import { $facebookErrorHandler } from '../../../utils/error-handler';
import { $stringifyParams } from '../../../utils/stringify-params';

// types
import { NextFunction } from 'express';

// constants
import { FACEBOOK_GRAPH_URL, FACEBOOK_API_VERSION } from './facebook-constants';

export async function _getFacebookPost(
  options: { postId: string; access_token: string; fields: string },
  next: NextFunction
) {
  try {
    const { postId, access_token, fields } = options;
    const stringifiedParams = await $stringifyParams({
      fields,
      access_token,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${postId}?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log('Error Facebook Get Post', error);
    return next(await $facebookErrorHandler(error));
  }
}
