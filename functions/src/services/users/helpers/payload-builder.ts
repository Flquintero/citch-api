import { Request } from 'express';
import { FieldValue } from '../../../config/firebase';

let _getCreateUserPayload = async (req: Request) => {
  const { email, firstName, lastName, emailVerified, fullName, provider } = req['body'];
  return {
    email,
    firstName,
    lastName,
    emailVerified,
    fullName,
    type: 'OWNER',
    enabled: true,
    provider,
    createdOn: FieldValue.serverTimestamp(),
    updatedOn: FieldValue.serverTimestamp(),
  };
};

export { _getCreateUserPayload };
