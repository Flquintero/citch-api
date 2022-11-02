import { FieldValue } from '../../../config/firebase';
import { $toDocReference } from '../../../utils/firebase/firestorm/firebase-firestorm-helpers';
import { EFacebookObjectives, IDBFacebookCampaign } from '../../../types/modules/facebook';

let _getCreateDBFacebookCampaignPayload = async (options: IDBFacebookCampaign) => {
  const { organizationPathId, ...createData } = options;
  return {
    ...createData,
    organization: await $toDocReference(organizationPathId as string),
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
  };
};
let _getupdateDBFacebookCampaignPayload = async (options: { facebookObjectiveIdentifier: EFacebookObjectives }) => {
  const { facebookObjectiveIdentifier } = options;
  return {
    facebookObjectiveIdentifier,
    updatedOn: FieldValue.serverTimestamp(),
  };
};

export { _getCreateDBFacebookCampaignPayload, _getupdateDBFacebookCampaignPayload };
