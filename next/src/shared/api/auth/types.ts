import { IUser } from '../users/types';

export type IUserSignUp = Pick<IUser, 'name' | 'email'> & { password: string };

export interface IUserSignIn {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface IVerifyUser {
  email: string;
  code: string;
}

export interface IResetPassword extends IVerifyUser {
  password: string;
}
