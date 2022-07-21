import { NextFunction } from 'express';
import { $axiosErrorHandler, $firestormErrorHandler } from '../../utils/error-handler';
import { $getDocumentId } from '../../utils/firestorm-helpers';
import { db } from '../../config/firebase';

const USERS_DB = db.collection('users');

// Type

export default {
  list: async function (options: any, next: NextFunction) {
    try {
      const users: any = await USERS_DB.get();
      //TO DO: Add this as a helper function
      const allEntries: any[] = [];
      users.forEach((doc: any) => allEntries.push(doc.data()));
      // end helper
      return allEntries;
    } catch (error: any) {
      return next(await $axiosErrorHandler(error));
    }
  },
  create: async function (options: any, next: NextFunction) {
    try {
      let user = await USERS_DB.add(options);
      return user.path;
    } catch (error: any) {
      console.log('CREATE USERS ERROR', error);
      return next(await $firestormErrorHandler(error));
    }
  },
  update: async function (options: any, next: NextFunction) {
    try {
      const { userPathId, organizationPathId } = options;
      return await USERS_DB.doc(await $getDocumentId(userPathId)).update({
        organization: organizationPathId,
      });
    } catch (error: any) {
      console.log('UPDATE USERS ERROR', error);
      return next(await $firestormErrorHandler(error));
    }
  },
};
