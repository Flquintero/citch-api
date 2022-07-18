export interface IVerifyPassword {
  apiKey: string;
  oobCode: string;
}
export interface IConfirmPasswordReset {
  newPassword: string | number;
  oobCode: string;
  apiKey: string;
}
