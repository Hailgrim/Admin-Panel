export interface IUpdatePassword {
  oldPassword?: string;
  newPassword: string;
}

export interface IChangeEmailRequest {
  newEmail: string;
}

export interface IChangeEmailConfirm {
  code: string;
}

export interface ISession {
  ip: string;
  userAgent?: string;
  updatedAt: Date;
  sign: string;
}

export type TExternalSession = Omit<ISession, 'sign'> & {
  id: string;
  current: boolean;
};
