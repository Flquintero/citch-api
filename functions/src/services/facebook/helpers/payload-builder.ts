import { FieldValue } from '../../../config/firebase';
import { $toDocReference } from '../../../utils/firebase/firestorm/firebase-firestorm-helpers';
import { EFacebookObjectives } from '../../../types/modules/facebook';

let _getCreateDBFacebookCampaignPayload = async (options: {
  facebookCampaigns: string[];
  facebookObjectiveIdentifier: EFacebookObjectives;
  organizationPathId: string;
}) => {
  const { facebookCampaigns, organizationPathId, facebookObjectiveIdentifier } = options;
  return {
    facebookCampaigns,
    facebookObjectiveIdentifier,
    organization: await $toDocReference(organizationPathId as string),
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
  };
};
let _getupdateDBFacebookCampaignPayload = async () => {
  return {
    updatedOn: FieldValue.serverTimestamp(),
  };
};

export { _getCreateDBFacebookCampaignPayload, _getupdateDBFacebookCampaignPayload };
