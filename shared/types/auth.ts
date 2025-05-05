import { IUser } from './user';

export interface ISession {
  userAgent?: string;
  ip: string;
  updatedAt: Date;
}

export interface IExternalSession extends ISession {
  id: string;
  current: boolean;
}

export type TSignUp = Pick<IUser, 'email' | 'password' | 'name'>;
