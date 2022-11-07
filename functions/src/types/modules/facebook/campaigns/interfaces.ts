import {
  EFacebookObjectiveIdentifier,
  EFacebookObjectiveName,
  EFacebookObjectiveValue,
  EFacebookObjectiveDisplayName,
  EFacebookObjectiveDescription,
} from './enums';

import { DocumentData } from 'firebase-admin/firestore';

export interface ISaveFacebookCampaignObject {
  campaignId?: string;
  campaignData: {
    name?: string;
    facebookObjectiveValues?: IFacebookObjective['facebookValues']; // from our set objectives
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
  savedFacebookCampaignId: string;
  updateContent: IFacebookCampaignData;
}
