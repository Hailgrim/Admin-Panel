import { WithoutNulls } from '@/shared/lib/types';
import { IUser } from '../users/types';

export type TSignUp = WithoutNulls<
  Required<Pick<IUser, 'email' | 'password' | 'name'>>
>;

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  code: string;
  password: string;
}

export interface IVerifyUser {
  email: string;
  code: string;
}

export interface ISignIn {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface ISignInGoogle {
  googleAccessToken: string;
}
