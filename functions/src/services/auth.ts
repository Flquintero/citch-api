import { NextFunction } from 'express';
import { $apiRequest } from '../utils/https-call';
import { $axiosErrorHandler } from '../utils/axios-error-handler';

// Type
import { IVerifyPassword, IConfirmPasswordReset } from '../types/services/auth';

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
      next(await $axiosErrorHandler(error));
    }
  },
  confirmPasswordReset: async function (options: IConfirmPasswordReset, next: NextFunction) {
    let { newPassword, oobCode, apiKey } = options;
    try {
      return await $apiRequest({
        method: 'post',
        url: `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
        data: { oobCode, newPassword },
      });
    } catch (error: any) {
      next(await $axiosErrorHandler(error));
    }
  },
};
