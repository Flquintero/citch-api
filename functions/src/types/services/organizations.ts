import { DocumentData, Timestamp } from 'firebase-admin/firestore';

export enum OrganizationRoles {
  'admin',
}

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
  roles: {
    [uid: string]: OrganizationRoles; // add an enum possibilities maybe?
  };
}
