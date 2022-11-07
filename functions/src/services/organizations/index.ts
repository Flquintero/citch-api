// helpers
import { $firestormErrorHandler } from '../../utils/error-handler';
import { $getDocumentId } from '../../utils/firebase/firestorm/firebase-firestorm-helpers';
import { _getCreateOrganizationPayload } from './helpers/payload-builder';
// types
import { NextFunction } from 'express';
import { IUpdateObject, IReadObject } from '../../types/general/services';
import { ICreateOrganization } from '../../types/modules/organizations/interfaces';
// declarations
import { db } from '../../config/firebase';
const ORGANIZATIONS_DB = db.collection('organizations');

export default {
  read: async function (options: IReadObject, next: NextFunction) {
    try {
      const { id } = options;
      const organization = await ORGANIZATIONS_DB.doc(id).get();
      return organization.data();
    } catch (error: any) {
      return next(await $firestormErrorHandler(error));
    }
  },
  create: async function (options: ICreateOrganization, next: NextFunction) {
    try {
      const organization = await ORGANIZATIONS_DB.add(await _getCreateOrganizationPayload(options));
      return organization.path;
    } catch (error: any) {
      return next(await $firestormErrorHandler(error));
    }
  },
  update: async function (options: IUpdateObject, next: NextFunction) {
    try {
      const { pathId, updateData } = options;
      return await ORGANIZATIONS_DB.doc(await $getDocumentId(pathId)).update({
        ...updateData,
      });
    } catch (error: any) {
      console.log('UPDATE ORGANIZATIONS ERROR', error);
      return next(await $firestormErrorHandler(error));
    }
  },
};
