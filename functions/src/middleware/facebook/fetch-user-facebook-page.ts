import { Request, Response, NextFunction } from 'express';
import { _getFacebookPage } from '../../services/facebook/helpers/facebook-page-requests';
import { $facebookErrorHandler } from '../../utils/error-handler';

let $getFacebookPage = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { pageId } = req.body;
    const { access_token } = req.body.organization.facebookData;
    const pageData = await _getFacebookPage(
      {
        pageId: pageId,
        access_token,
        fields: `access_token`,
      },
      next
    );
    req.body.facebookPageData = pageData;
    next();
  } catch (error: any) {
    return next(await $facebookErrorHandler(error));
  }
};

export { $getFacebookPage };
