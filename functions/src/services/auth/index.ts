// helpers
import { $apiRequest } from '../../utils/https-call';
import { $axiosErrorHandler } from '../../utils/error-handler';
// types
import { NextFunction } from 'express';
import { IVerifyPassword, IConfirmPasswordReset } from '../../types/modules/auth';
// declarations
const IDENTITY_TOOLKIT_URL = 'https://identitytoolkit.googleapis.com';
const IDENTITY_TOOLKIT_VERSION = '/v1';

export default {
  verifyPassword: async function (options: IVerifyPassword, next: NextFunction) {
    let { apiKey, oobCode } = options;
    try {
      return await $apiRequest({
        method: 'post',
        url: `${IDENTITY_TOOLKIT_URL}${IDENTITY_TOOLKIT_VERSION}/accounts:resetPassword?key=${apiKey}`,
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
        url: `${IDENTITY_TOOLKIT_URL}${IDENTITY_TOOLKIT_VERSION}/accounts:resetPassword?key=${apiKey}`,
        data: { oobCode, newPassword },
      });
    } catch (error: any) {
      next(await $axiosErrorHandler(error));
    }
  },
};
