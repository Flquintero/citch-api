// Helpers
import { $facebookErrorHandler } from "../../../utils/error-handler";

// Local Helpers
import {
  _getFacebookLocations,
  _getFacebookInterests,
} from "./helpers/facebook-audience-requests";

import { _getFacebookCampaign } from "../campaigns/helpers/facebook-campaign-requests";

// Types
import { NextFunction, Request } from "express";

export const audience = {
  getLocations: async function (req: Request, next: NextFunction) {
    try {
      const { locationSearchString } = req.params;
      const { access_token } = req.body.organization.facebookData;
      const locationsData = await _getFacebookLocations(
        { locationSearchString, access_token },
        next
      );
      return locationsData.data;
    } catch (error: any) {
      console.log("Error Getting Facebook Locations", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  getInterests: async function (req: Request, next: NextFunction) {
    try {
      const { interestSearchString } = req.params;
      const { access_token } = req.body.organization.facebookData;
      const interestsData = await _getFacebookInterests(
        { interestSearchString, access_token },
        next
      );
      return interestsData.data;
    } catch (error: any) {
      console.log("Error Getting Facebook Locations", error);
      return next(await $facebookErrorHandler(error));
    }
  },
  saveAudience: async function (req: Request, next: NextFunction) {
    try {
      console.log("req", req.body);
      //const { access_token } = req.body.organization.facebookData;
      // const { facebookTargetingAudience } = req.body.saveCampaignObject;
      //const { facebookCampaigns } = req.body.savedDBFacebookCampaign;
      // const adSetData = await _saveFacebookAdSet( <-- TO DO
      //   { interestSearchString, access_token },
      //   next
      // );
    } catch (error: any) {
      console.log("Error Saving Audience", error);
      return next(await $facebookErrorHandler(error));
    }
  },
};
