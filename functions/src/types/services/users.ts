export interface ICreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  fullName: string;
  provider: string;
  uid: string;
}
