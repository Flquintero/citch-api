import { NextFunction } from 'express';
import { $axiosErrorHandler } from '../../utils/axios-error-handler';
import { db } from '../../config/firebase';

const ORGANIZATIONS_DB = db.collection('organizations');

// Type
export default {
  create: async function (options: any, next: NextFunction) {
    try {
      return await ORGANIZATIONS_DB.add(options);
    } catch (error: any) {
      return next(await $axiosErrorHandler(error));
    }
  },
};
