// helpers
import { $axiosErrorHandler, $firestormErrorHandler } from '../../utils/error-handler';
import { $getDocumentId } from '../../utils/firebase/firestorm/firebase-firestorm-helpers';
import { _getCreateUserPayload } from './helpers/payload-builder';
// types
import { IUpdateObject } from '../../types/general/services';
import { Request, NextFunction } from 'express';
// declarations
import { db } from '../../config/firebase';
// USING NODE.JS FIREBASE ADMIN SDK SO ADDING TO COLLECTIONS WOULD BE WITH WEB VERSION 8 EXAMPLES IN FIREBASE PAGE
const USERS_DB = db.collection('users');

export default {
  //NOT USED HERE AS EXAMPLE TO SHOW WE NEED TO DO A FOREACH

  // list: async function (options: any, next: NextFunction) {
  //   try {
  //     const users: any = await USERS_DB.get();
  //     //TO DO: Add this as a helper function
  //     const allEntries: any[] = [];
  //     users.forEach((doc: any) => allEntries.push(doc.data()));
  //     // end helper
  //     return allEntries;
  //   } catch (error: any) {
  //     return next(await $axiosErrorHandler(error));
  //   }
  // },

  create: async function (req: Request, next: NextFunction) {
    try {
      // uid comes from id token middlewarw
      let user = await USERS_DB.doc(req.body.uid).set(await _getCreateUserPayload(req));
      return user;
    } catch (error: any) {
      console.log('CREATE USERS ERROR', await $axiosErrorHandler(error));
      return next(await $axiosErrorHandler(error));
    }
  },
  // Brings the pathId as {{collections}}/{{id}} and an updateData object with what needs to be updated
  update: async function (options: IUpdateObject, next: NextFunction) {
    try {
      const { pathId, updateData } = options;
      return await USERS_DB.doc(await $getDocumentId(pathId)).update({
        ...updateData,
      });
    } catch (error: any) {
      console.log('UPDATE USERS ERROR', error);
      return next(await $firestormErrorHandler(error));
    }
  },
};
