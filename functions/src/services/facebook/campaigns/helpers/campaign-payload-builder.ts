import { FieldValue } from '../../../../config/firebase';
import { $toDocReference } from '../../../../utils/firebase/firestorm/firebase-firestorm-helpers';
import { IDBFacebookCampaign } from '../../../../types/modules/facebook/campaigns/interfaces';

let _getCreateDBFacebookCampaignPayload = async (options: IDBFacebookCampaign) => {
  const { organizationPathId, ...createData } = options;
  return {
    ...createData,
    organization: await $toDocReference(organizationPathId as string),
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
  };
};
let _getupdateDBFacebookCampaignPayload = async (options: { updateData: IDBFacebookCampaign }) => {
  const { updateData } = options;
  return {
    ...updateData,
    updatedOn: FieldValue.serverTimestamp(),
  };
};

export { _getCreateDBFacebookCampaignPayload, _getupdateDBFacebookCampaignPayload };
