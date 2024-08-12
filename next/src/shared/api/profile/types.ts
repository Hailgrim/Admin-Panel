export interface ISession {
  id: string;
  userId: string;
  ip: string;
  userAgent?: string;
  current: boolean;
  updatedAt: Date;
}

export interface IUpdatePassword {
  oldPassword?: string;
  newPassword: string;
}
