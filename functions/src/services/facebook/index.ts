// helpers
//import { $firestormErrorHandler } from '../../utils/error-handler';
// types
import { NextFunction, Request } from 'express';

export default {
  getFacebookConsentUrl: async function (options: Request, next: NextFunction) {
    console.log('InitConsent');
    // try {
    //   const organization = await ORGANIZATIONS_DB.add(await _getCreateOrganizationPayload(options));
    //   return organization.path;
    // } catch (error: any) {
    //   return next(await $firestormErrorHandler(error));
    // }
  },
};
