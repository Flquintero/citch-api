import { DocumentData, Timestamp } from 'firebase-admin/firestore';
import { IFacebookTokenData } from '../facebook/auth/interfaces';
import { EOrganizationRoles } from './enums';

export interface ICreateOrganization extends ReadableStream<Uint8Array> {
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  fullName: string;
  uid: string;
  providerId: string;
  userDocReference: string;
}

export interface IOrganization extends DocumentData {
  createdOn: Timestamp;
  updatedOn: Timestamp;
  email: string;
  enabled: boolean;
  facebookData?: IFacebookTokenData | null;
  roles: {
    [uid: string]: EOrganizationRoles; // add an enum possibilities maybe?
  };
}
