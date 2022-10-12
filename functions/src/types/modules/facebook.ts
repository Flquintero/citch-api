export interface IFacebookTokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  app_id: string;
}

export interface IFacebookPageCheckInListOfPagesData {
  pageId: string;
  pages: IFacebookPage[];
  pagesTotalCount: number;
  pageLimit: number;
  pagesNext: string; // URL
  currentIndex: number;
}

export interface IFacebookPage {
  id: string;
  name?: string;
  picture?: IFacebookPicture;
  access_token?: string;
}

export interface IFacebookPicture {
  data: { height: number; is_silhouette: boolean; url: string; width: number };
}

export interface IFacebookPageLinkedStatus {
  status: FacebookPageLinkedStatus;
}

export interface IFacebookCreateCampaignData {
  name?: string;
  objective?: string;
  [property: string]: any;
}

export enum FacebookPageLinkedMessage {
  already_linked = 'Page Already Connected',
  link_success = 'Page Connection Success',
}

export enum FacebookPageLinkedStatus {
  not_linked, // 0
  linked, // 1
}

export enum FacebookConnectionStatus {
  disconnected, // 0
  connected, // 1
  expired, // 2
}
