// helpers
import { $apiRequest } from "../../utils/https-call";
import {
  _getInstagramPost,
  _getUserInstagramPosts,
} from "../../services/facebook/pages/helpers/instagram-post-requests";
import { $facebookErrorHandler } from "../../utils/error-handler";
//types
import { Request, Response, NextFunction } from "express";

let $getInstagramPost = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { facebookPageData, postShortCodeId } = req.body;
    const { access_token } = facebookPageData;
    const instagramAccountId =
      req.body.facebookPageData?.connected_instagram_account?.id;
    const userIGPayload = {
      instagramAccountId,
      access_token,
      fields: "shortcode,media_type,ig_id,id,media_product_type",
    };
    const userInstagramPosts = await _getUserInstagramPosts(
      userIGPayload,
      next
    );
    const postIdPayload = {
      postShortCodeId,
      userInstagramPosts,
    };
    const post = await __findInstagramPost(postIdPayload, next);
    req.body.instagramPostInfo = {
      postId: post.id,
      postPlacement: post.media_product_type,
      postMediaType: post.media_type,
    };
    next();
  } catch (error: any) {
    // To Do: Need to catch when the code is 100 and return a message saying wrong page
    return next(await $facebookErrorHandler(error));
  }
};

export { $getInstagramPost };

// local helpers

// If connected to our Business Manager
export async function __findInstagramPost(
  options: { postShortCodeId: string; userInstagramPosts: any },
  next: NextFunction
): Promise<any | void> {
  try {
    const { postShortCodeId, userInstagramPosts } = options;
    const checkData: any = {
      postShortCodeId,
      posts: userInstagramPosts.data,
      pagesNext: userInstagramPosts.paging?.next,
    };
    return await __checkForChosenPostInListOfPosts(checkData, next);
  } catch (error: any) {
    console.log("Error Find Instagram Post", error);
    return next(await $facebookErrorHandler(error));
  }
}

// checks to see if a page is included in the list of pages returned from a next url
async function __checkForChosenPostInListOfPosts(
  options: any,
  next: NextFunction
): Promise<any | void> {
  try {
    const { postShortCodeId, posts, pagesNext } = options;
    // could use find below instead of filter, as we are only getting one
    const postIncluded = posts.find((post: any) => {
      return post.shortcode === postShortCodeId;
    });
    // if doesnt find on current search page
    if (!postIncluded) {
      // if subsequent page available
      if (pagesNext) {
        const newPosts = await $apiRequest({
          url: pagesNext,
        });
        const searchData = {
          postShortCodeId,
          posts: newPosts.data,
          pagesNext: newPosts.paging?.next,
        };
        return __checkForChosenPostInListOfPosts(searchData, next);
        //if no other page available return that we didnt find it
      } else {
        throw Error("Post not found");
      }
      // if finds it on current page
    } else {
      return postIncluded;
    }
  } catch (error: any) {
    console.log("Error Checking IG Post is in List", error);
    return next(await $facebookErrorHandler(error));
  }
}
