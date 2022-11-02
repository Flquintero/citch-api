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

export interface IFacebookCampaignData {
  id?: string;
  name?: string;
  objective?: string;
  [property: string]: any;
}

export interface ICreateCampaignResponse {
  campaign: IFacebookCampaignData;
  facebookAdAccount: string;
}

export interface ICreateMultipleCampaignsResponse {
  campaigns: string[];
  facebookAdAccount: string;
}

export interface IDBFacebookCampaign {
  facebookCampaigns?: string[];
  facebookObjectiveIdentifier?: EFacebookObjectiveIdentifier;
  facebookAdAccount?: string;
  organizationPathId?: string;
}

export interface IFacebookObjective {
  identifier: EFacebookObjectiveIdentifier;
  name: EFacebookObjectiveName;
  facebookValues: EFacebookObjectiveValue[];
  displayName: EFacebookObjectiveDisplayName;
  description: EFacebookObjectiveDescription;
}

export enum EFacebookObjectiveValue {
  reach = 'REACH',
  engagements = 'POST_ENGAGEMENT',
  video_views = 'VIDEO_VIEWS',
}

export enum EFacebookObjectiveDisplayName {
  impressions = 'Impressions',
  reach = 'Reach',
  engagements = 'Engagements',
  video_views = 'Video Views',
  citch_reach = 'Citch Reach',
}

export enum EFacebookObjectiveDescription {
  impressions = 'Get more views from a specific demographicof people',
  reach = 'Get more views from a specific demographicof people',
  engagements = 'Get more likes and comments from a spefic demographic',
  video_views = 'Get more video views from a specific group of people',
  citch_reach = 'Get more views, likes and comments from a specific group of people',
}

export enum EFacebookObjectiveIdentifier {
  impressions,
  reach,
  engagements,
  video_views,
  citch_reach,
}

export enum EFacebookObjectiveName {
  impressions = 'impressions',
  reach = 'reach',
  engagements = 'engagements',
  video_views = 'video views',
  citch_reach = 'citch_reach',
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
