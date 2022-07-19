import { NextFunction } from 'express';
import { $axiosErrorHandler } from '../utils/axios-error-handler';
import { db } from '../config/firebase';

// Type

export default {
  list: async function (options: any, next: NextFunction) {
    try {
      const users: any = await db.collection('users').get();
      console.log('DATA', users.docs);
      return users.docs;
    } catch (error: any) {
      return next(await $axiosErrorHandler(error));
    }
  },
};
