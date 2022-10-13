import { FieldValue } from '../../../config/firebase';
import { $toDocReference } from '../../../utils/firebase/firestorm/firebase-firestorm-helpers';

let _getCreateDBFacebookCampaignPayload = async (options: {
  facebookCampaignId: string;
  organizationPathId: string;
}) => {
  const { facebookCampaignId, organizationPathId } = options;
  return {
    facebookCampaignId,
    organization: await $toDocReference(organizationPathId as string),
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
  };
};

export { _getCreateDBFacebookCampaignPayload };
