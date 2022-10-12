import { FACEBOOK_AD_ACCOUNTS } from './facebook-constants';

export function _chooseFromAvailableAdAccounts() {
  const adAccounts = FACEBOOK_AD_ACCOUNTS?.split(',') as string[];
  const chosenAccount = adAccounts[Math.floor(Math.random() * adAccounts.length)];
  return chosenAccount;
}
