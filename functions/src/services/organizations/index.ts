import { NextFunction } from 'express';
import { $firestormErrorHandler } from '../../utils/error-handler';
import { $getDocumentId } from '../../utils/firestorm-helpers';
import { _getCreateOrganizationPayload } from './helpers/payload-builder';
import { db } from '../../config/firebase';

const ORGANIZATIONS_DB = db.collection('organizations');

// Type
export default {
  create: async function (options: any, next: NextFunction) {
    try {
      const organization = await ORGANIZATIONS_DB.add(await _getCreateOrganizationPayload(options));
      return organization.path;
    } catch (error: any) {
      return next(await $firestormErrorHandler(error));
    }
  },
  update: async function (options: any, next: NextFunction) {
    try {
      const { organizationPathId } = options;
      return await ORGANIZATIONS_DB.doc(await $getDocumentId(organizationPathId)).update({
        updateFields: options.updateFields,
      });
    } catch (error: any) {
      console.log('UPDATE ORGANIZATIONS ERROR', error);
      return next(await $firestormErrorHandler(error));
    }
  },
};
