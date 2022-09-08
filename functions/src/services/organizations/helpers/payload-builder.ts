import { FieldValue } from '../../../config/firebase';
import { Request } from 'express';

let _getCreateOrganizationPayload = async (reqBody: Request['body']) => {
  const { email, uid } = reqBody;
  return {
    email,
    roles: {
      [uid]: 'admin', // Since this is create and can only be done by admin the user will be added as admin
    },
    enabled: true,
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
  };
};

export { _getCreateOrganizationPayload };
