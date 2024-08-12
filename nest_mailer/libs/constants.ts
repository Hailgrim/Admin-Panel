/** Email validation regex */
export const EMAIL_REGEX = /^[\w.]+@\w+\.+\w{2,4}$/;

export const DEV = 'development';

export enum MailTemplates {
  Registration = 'registration',
  ForgotPassword = 'forgot-password',
  ChangeEmail = 'change-email',
}
