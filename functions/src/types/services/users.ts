export interface ICreateUserPayload extends ReadableStream<Uint8Array> {
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  fullName: string;
  uid: string;
  providerId: string;
}
