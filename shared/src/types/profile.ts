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
  userAgent?: string;
  ip: string;
  updatedAt: Date;
}

export interface IExternalSession extends ISession {
  id: string;
  current: boolean;
}
