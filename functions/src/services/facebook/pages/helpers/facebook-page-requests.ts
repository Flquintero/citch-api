// helpers
import { $apiRequest } from "../../../../utils/https-call";
import { $facebookErrorHandler } from "../../../../utils/error-handler";
import { $stringifyParams } from "../../../../utils/stringify-params";

// types
import { NextFunction } from "express";
import {
  IFacebookPage,
  IFacebookPageCheckInListOfPagesData,
  IFacebookPageLinkedStatus,
} from "../../../../types/modules/facebook/pages/interfaces";
import { EFacebookPageLinkedStatus } from "../../../../types/modules/facebook/pages/enums";

//constants
import {
  FACEBOOK_GRAPH_URL,
  FACEBOOK_SYSTEM_USER_ID,
  FACEBOOK_BUSINESS_ID,
  FACEBOOK_SYSTEM_USER_TOKEN,
  FACEBOOK_API_VERSION,
} from "../../helpers/facebook-constants";

export async function _getFacebookPage(
  options: { pageId: string; access_token: string; fields: string },
  next: NextFunction
): Promise<IFacebookPage | void> {
  try {
    const { pageId, access_token, fields } = options;

    const stringifiedParams = await $stringifyParams({
      fields,
      access_token,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${pageId}?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Get Facebook Page", error);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _getUserPages(
  options: { userId: string; access_token: string; fields: string },
  next: NextFunction
): Promise<IFacebookPage[] | void> {
  try {
    const { access_token, fields, userId } = options;
    const stringifiedParams = await $stringifyParams({
      fields,
      access_token,
    });
    // TO DO: Add paging to this, ad page limit and create paging ui and param for current page
    const pagesResponse = await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${userId}/accounts?${stringifiedParams}`,
    });
    return pagesResponse.data;
  } catch (error: any) {
    console.log("Error Get Facebook Pages", error);
    return next(await $facebookErrorHandler(error));
  }
}
// If connected to our Business Manager
export async function _checkPageLinkedToAppBusinessManager(
  options: { pageId: string; page_access_token: string },
  next: NextFunction
): Promise<IFacebookPageLinkedStatus | void> {
  try {
    const pageLimit = 15;
    const { pageId } = options;
    const linkedPages = await _getLinkedPagesToAppBusinessManager(
      { pageLimit },
      next
    );
    console.log("linked pages", linkedPages.data);
    const checkData: IFacebookPageCheckInListOfPagesData = {
      pageId,
      pages: linkedPages.data,
      pagesTotalCount: linkedPages.summary.total_count,
      pageLimit,
      pagesNext: linkedPages.paging.next,
      currentIndex: 0,
    };
    return await __checkForChosenPageinListOfPages(checkData, next);
  } catch (error: any) {
    console.log("Error Check Page Linked to Business Manager", error);
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
      summary: "total_count",
      limit: pageLimit,
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${FACEBOOK_BUSINESS_ID}/client_pages?${stringifiedParams}`,
    });
  } catch (error: any) {
    console.log("Error Get Linked Pages to Business Manager", error);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _connectUserPageToAppBusinessManager(
  options: {
    user_access_token: string;
    pageId: string;
  },
  next: NextFunction
) {
  try {
    const { user_access_token, pageId } = options;
    const stringifiedParams = await $stringifyParams({
      access_token: user_access_token,
    });
    console.log(
      "url adding to business manager",
      `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${FACEBOOK_BUSINESS_ID}/client_pages?${stringifiedParams}`
    );
    return await $apiRequest({
      method: "post",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${FACEBOOK_BUSINESS_ID}/client_pages?${stringifiedParams}`,
      data: {
        page_id: pageId,
        permitted_tasks: ["MANAGE", "ADVERTISE", "ANALYZE"],
      },
    });
  } catch (error: any) {
    console.log("Error Linking Page to Business Manager", error);
    return next(await $facebookErrorHandler(error));
  } finally {
  }
}
export async function _connectSystemUserToUserPage(
  options: {
    pageId: string;
  },
  next: NextFunction
) {
  try {
    const { pageId } = options;
    const stringifiedParams = await $stringifyParams({
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
    });
    console.log("pageId", pageId);
    console.log(
      "url",
      `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${pageId}/assigned_users?${stringifiedParams}`
    );
    return await $apiRequest({
      method: "post",
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${pageId}/assigned_users?${stringifiedParams}`,
      data: {
        tasks: ["MANAGE", "ADVERTISE", "ANALYZE"],
        user: FACEBOOK_SYSTEM_USER_ID,
        business: FACEBOOK_BUSINESS_ID,
      },
    });
  } catch (error: any) {
    console.log("Facebook Error connecting System User to Page", error.data);
    return next(await $facebookErrorHandler(error));
  }
}
export async function _checkSystemUserConnectedToUserPage(
  options: {
    pageId: string;
  },
  next: NextFunction
) {
  try {
    const { pageId } = options;
    const pageLimit = 15;
    let assignedUserPages = await _getSystemUserAssignedFacebookPages(
      { pageLimit },
      next
    );
    const checkData: IFacebookPageCheckInListOfPagesData = {
      pageId,
      pages: assignedUserPages.data,
      pagesTotalCount: assignedUserPages.summary.total_count,
      pageLimit,
      pagesNext: assignedUserPages.paging.next,
      currentIndex: 0,
    };
    return await __checkForChosenPageinListOfPages(checkData, next);
  } catch (error: any) {
    console.log(
      "Facebook Error Checking connecting System User to Page",
      error.data
    );
    return next(await $facebookErrorHandler(error));
  }
}
export async function _getSystemUserAssignedFacebookPages(
  options: {
    pageLimit: number;
  },
  next: NextFunction
) {
  try {
    const { pageLimit } = options;
    const stringifiedParams = await $stringifyParams({
      access_token: FACEBOOK_SYSTEM_USER_TOKEN,
      limit: pageLimit,
      summary: "total_count",
    });
    return await $apiRequest({
      url: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/${FACEBOOK_SYSTEM_USER_ID}/assigned_pages?${stringifiedParams}`,
      data: {
        tasks: ["MANAGE"],
        user: FACEBOOK_SYSTEM_USER_ID,
        business: FACEBOOK_BUSINESS_ID,
      },
    });
  } catch (error: any) {
    console.log("Facebook Error Getting System User Assigned Page", error);
    return next(await $facebookErrorHandler(error));
  }
}

// Local Helpers

// checks to see if a page is included in the list of pages returned from a next url
async function __checkForChosenPageinListOfPages(
  options: IFacebookPageCheckInListOfPagesData,
  next: NextFunction
): Promise<IFacebookPageLinkedStatus | void> {
  try {
    const {
      pageId,
      pages,
      pagesTotalCount,
      pageLimit,
      pagesNext,
      currentIndex,
    } = options;
    const pagingTotal = Math.ceil(pagesTotalCount / pageLimit);
    const pageIncludedArray = pages.filter((page: IFacebookPage) => {
      return page.id === pageId;
    });
    const pageIncluded = !!pageIncludedArray.length;
    // if doesnt find on current search page
    if (!pageIncluded) {
      // if subsequent page available
      if (currentIndex < pagingTotal && pagesNext) {
        const newPages = await $apiRequest({
          url: pagesNext,
        });
        const searchData = {
          pageId,
          pages: newPages.data,
          pagesTotalCount: newPages.summary.total_count,
          pageLimit,
          pagesNext: newPages.paging.next,
          currentIndex: currentIndex + 1,
        };
        return __checkForChosenPageinListOfPages(searchData, next);
        //if no other page available return that we didnt find it
      } else {
        return { status: EFacebookPageLinkedStatus.not_linked };
      }
      // if finds it on current page
    } else {
      return { status: EFacebookPageLinkedStatus.linked };
    }
  } catch (error: any) {
    console.log("Error Checking Page is in List", error);
    return next(await $facebookErrorHandler(error));
  }
}
