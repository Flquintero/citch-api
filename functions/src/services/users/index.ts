import { db } from '../../config/firebase';
import { $axiosErrorHandler, $firestormErrorHandler } from '../../utils/error-handler';
import { $getDocumentId } from '../../utils/firebase/firebase-firestorm-helpers';
import { $idTokenDecoded } from '../../utils/firebase/firebase-user-token';
import { _getCreateUserPayload } from './helpers/payload-builder';
import { IUpdateObject } from '../../types/general/services';
import { Request, NextFunction } from 'express';

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
      const decodedToken = await $idTokenDecoded(req, next);
      let user = await USERS_DB.add(await _getCreateUserPayload(req, decodedToken));
      return user.path;
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
