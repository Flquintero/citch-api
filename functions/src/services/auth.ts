import { NextFunction } from 'express';
import { $apiRequest } from '../utils/https-call';

// Type
import { IVerifyPassword } from '../types/services/auth';

export default {
  verifyPassword: async function (options: IVerifyPassword, next: NextFunction) {
    let { apiKey, oobCode } = options;
    try {
      return await $apiRequest({
        method: 'post',
        url: `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
        data: { oobCode },
      });
    } catch (error: any) {
      next(error.response.data.error);
    }
  },
};
