import {
  EFacebookObjectiveIdentifier,
  EFacebookObjectiveName,
  EFacebookObjectiveValue,
  EFacebookObjectiveDisplayName,
  EFacebookObjectiveDescription,
} from './enums';

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
