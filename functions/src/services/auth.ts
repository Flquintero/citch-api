import { $apiRequest } from '../utils/https-call';

export default {
  verifyPassword: async function (options: any) {
    let { apiKey, oobCode } = options;
    try {
      return await $apiRequest({
        method: 'post',
        url: `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
        data: { oobCode },
      });
    } catch (error: any) {
      console.log('Verify Password code error', error.response.data.error);
      return error.response.data.error;
    }
  },
};
