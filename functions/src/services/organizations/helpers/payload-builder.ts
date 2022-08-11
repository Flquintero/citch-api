import { FieldValue } from '../../../config/firebase';
import { Request } from 'express';

let _getCreateOrganizationPayload = async (reqBody: Request['body']) => {
  const { email, uid } = reqBody;
  return {
    email,
    owner: uid,
    enabled: true,
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
  };
};

export { _getCreateOrganizationPayload };
