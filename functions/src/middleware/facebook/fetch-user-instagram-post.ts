// helpers
import { $apiRequest } from "../../utils/https-call";
import {
  _getInstagramPost,
  _getUserInstagramPosts,
} from "../../services/facebook/pages/helpers/instagram-post-requests";
import { $facebookErrorHandler } from "../../utils/error-handler";
//types
import { Request, Response, NextFunction } from "express";
//import { IFacebookPage } from "../../types/modules/facebook/pages/interfaces";

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
    console.log("userInstagramPosts", userInstagramPosts);
    console.log("postShortCodeId", postShortCodeId);
    const postIdPayload = {
      postShortCodeId,
      userInstagramPosts,
    };
    const postId = await __findInstagramPost(postIdPayload, next);
    req.body.instagramPostInfo = {
      postId: postId.id,
      postPlacement: postId.media_product_type,
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
    const postIncludedArray = posts.filter((post: any) => {
      return post.shortcode === postShortCodeId;
    });
    const postIncluded = !!postIncludedArray.length;
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
      return postIncludedArray[0];
    }
  } catch (error: any) {
    console.log("Error Checking IG Post is in List", error);
    return next(await $facebookErrorHandler(error));
  }
}
