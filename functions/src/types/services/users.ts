import { Timestamp, DocumentReference, DocumentData } from 'firebase-admin/firestore';
export interface ICreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  fullName: string;
  provider: string;
  uid: string;
}
export interface IUser extends DocumentData {
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  provider: string;
  createdOn: Timestamp;
  updatedOn: Timestamp;
  organization: DocumentReference;
  enabled: boolean;
}
