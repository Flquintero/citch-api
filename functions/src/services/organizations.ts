import { NextFunction } from 'express';
import { $axiosErrorHandler } from '../utils/axios-error-handler';
import { db } from '../config/firebase';

const USERS_DB = db.collection('organizations');

// Type

export default {
  create: async function (options: any, next: NextFunction) {
    try {
      const users: any = await USERS_DB.get();
      //TO DO: Add this as a helper function
      const allEntries: any[] = [];
      users.forEach((doc: any) => allEntries.push(doc.data()));
      // end helper

      console.log('DATA', allEntries);
      return allEntries;
    } catch (error: any) {
      return next(await $axiosErrorHandler(error));
    }
  },
};
