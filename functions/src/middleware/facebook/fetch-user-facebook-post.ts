// helpers
import { _getFacebookPost } from '../../services/facebook/pages/helpers/facebook-post-requests';
import { $facebookErrorHandler } from '../../utils/error-handler';
//types
import { Request, Response, NextFunction } from 'express';
import { IFacebookPage } from '../../types/modules/facebook/pages/interfaces';

let $getFacebookPost = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { facebookPageData, postId } = req.body;
    // TO DO: If we have more types that we need to validate then make it a service
    if (req.body.postId) {
      var postData = await _getFacebookPost(
        {
          postId,
          access_token: (facebookPageData as IFacebookPage).access_token as string, // Page Token
          fields: `id,is_eligible_for_promotion`, // This id we get back is actually the one we can use in api
        },
        next
      );
      // need to uncomment live
      //   if (postData.is_eligible_for_promotion === false) {
      //     return next(
      //       await $genericErrorHandler({ code: 400, message: 'Post not eligible for Promotion' })
      //     );
      //   }
      req.body.facebookPostData = postData;
    }
    next();
  } catch (error: any) {
    // To Do: Need to catch when the code is 100 and return a message saying wrong page
    return next(await $facebookErrorHandler(error));
  }
};

export { $getFacebookPost };
