export enum EFacebookCampaignStatus {
  active = "ACTIVE",
  paused = "PAUSED",
  deleted = "DELETED",
  archived = "ARCHIVED",
}

export enum EFacebookCampaignBidStrategy {
  lowCostWithoutCap = "LOWEST_COST_WITHOUT_CAP",
  lowCostWithCap = "LOWEST_COST_WITH_BID_CAP",
  costCap = "COST_CAP",
}

export enum EFacebookCampaignBuyingType {
  auction = "AUCTION",
  reserved = "RESERVED",
}

export enum EFacebookCampaignPlaceholder {
  budget = "100000", // $1000
}

export enum EFacebookBudgetHelper {
  multiplier = 100, // facebook multiplies budget amount by 100
}

export enum EFacebookObjectiveValue {
  reach = "REACH",
  engagements = "POST_ENGAGEMENT",
  video_views = "VIDEO_VIEWS",
}

export enum EFacebookObjectiveDisplayName {
  impressions = "Impressions",
  reach = "Reach",
  engagements = "Engagements",
  video_views = "Video Views",
  citch_reach = "Citch Reach",
}

export enum EFacebookObjectiveDescription {
  impressions = "Get more views from a specific demographicof people",
  reach = "Get more views from a specific demographicof people",
  engagements = "Get more likes and comments from a spefic demographic",
  video_views = "Get more video views from a specific group of people",
  citch_reach = "Get more views, likes and comments from a specific group of people",
}

export enum EFacebookObjectiveIdentifier {
  impressions,
  reach,
  engagements,
  video_views,
  citch_reach,
}

export enum EFacebookObjectiveName {
  impressions = "impressions",
  reach = "reach",
  engagements = "engagements",
  video_views = "video views",
  citch_reach = "citch_reach",
}

export enum EFacebookAdSetStatus {
  active = "ACTIVE",
  paused = "PAUSED",
  deleted = "DELETED",
  archived = "ARCHIVED",
}

export enum EFacebookAdStatus {
  active = "ACTIVE",
  paused = "PAUSED",
}

export enum EFacebookAdSetBillingEvent {
  impressions = "IMPRESSIONS",
  app_installs = "APP_INSTALLS",
  clicks = "CLICKS",
  link_clicks = "LINK_CLICKS",
  none = "NONE",
  offer_claims = "OFFER_CLAIMS",
  page_likes = "PAGE_LIKES",
  post_engamente = "POST_ENGAGEMENT",
  thruplay = "THRUPLAY",
  purchase = "PURCHASE",
  listing_interaction = "LISTING_INTERACTION",
}
