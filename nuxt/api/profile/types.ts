export interface ISession {
  id: string;
  current: boolean;
  ip: string;
  userAgent?: string;
  updatedAt: Date;
}

export interface IUpdatePassword {
  oldPassword?: string;
  newPassword: string;
}
