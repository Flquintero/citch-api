export interface IFacebookTokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  app_id: string;
}

export enum FacebookConnectionStatus {
  disconnected, // 0
  connected, // 1
  expired, // 2
}
