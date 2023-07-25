import {
  EFacebookObjectiveIdentifier,
  EFacebookObjectiveName,
  EFacebookObjectiveValue,
  EFacebookObjectiveDisplayName,
  EFacebookObjectiveDescription,
} from "./enums";

import { DocumentData } from "firebase-admin/firestore";

export interface ISaveFacebookCampaignObject {
  campaignId?: string;
  campaignData: {
    name?: string;
    facebookObjectiveValues?: IFacebookObjective["facebookValues"]; // from our set objectives
    facebookObjectiveIdentifier?: EFacebookObjectiveIdentifier; // from our set objectives
  };
}
//data that is used directly to save a campaign in facebook they have to match the facebook marketing api
export interface IFacebookCampaignData {
  id?: string;
  name?: string;
  objective?: string;
}

export interface ICreateCampaignResponse {
  campaign: IFacebookCampaignData;
  facebookAdAccount: string;
}

export interface ICreateMultipleCampaignsResponse {
  campaigns: string[];
  facebookAdAccount?: string;
}

export interface IDBFacebookCampaign extends DocumentData {
  facebookCampaigns?: string[];
  facebookObjectiveIdentifier?: EFacebookObjectiveIdentifier;
  facebookAdAccount?: string;
  organizationPathId?: string;
  facebookPage?: string;
  promotedPost?: string;
  instagramAccount?: string;
  platform?: string;
}
export interface IDBUpdateFacebookCampaignPayload {
  campaignId: string;
  updateData: IDBFacebookCampaign;
}

export interface IFacebookObjective {
  identifier: EFacebookObjectiveIdentifier;
  name: EFacebookObjectiveName;
  facebookValues: EFacebookObjectiveValue[];
  displayName: EFacebookObjectiveDisplayName;
  description: EFacebookObjectiveDescription;
}

export interface IUpdateFacebookCampaignPayload {
  savedFacebookCampaignId?: string;
  updateContent: IFacebookCampaignData;
}

export interface IFacebookAudience {
  [property: string]:
    | undefined
    | string
    | IFacebookLocation[]
    | IFacebookInterest[];
  ageMin?: string;
  ageMax?: string;
  gender?: string;
  chosenLocations?: IFacebookLocation[];
  chosenInterests?: IFacebookInterest[];
}

export interface IFacebookLocation {
  [property: string]: string | boolean | number | undefined;
  country_code: string;
  country_name: string;
  key: string;
  name: string;
  region: string;
  region_id: number;
  primary_city?: string;
  supports_city: boolean;
  supports_region: boolean;
  type: string;
}

export interface IFacebookInterest {
  audience_size_lower_bound: number;
  audience_size_upper_bound: number;
  description: string;
  id: string;
  name: string;
  path: string[];
  topic: string;
}
