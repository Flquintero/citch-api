// Helpers
import { $facebookErrorHandler } from "../../../utils/error-handler";

// Local Helpers
import { _getFacebookLocations } from "./helpers/facebook-locations-requests";

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
};
