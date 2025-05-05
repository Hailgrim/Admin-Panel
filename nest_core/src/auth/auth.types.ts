import { FastifyRequest } from 'fastify';
import { WithoutNulls } from 'libs/types';

import { IUser } from 'src/users/users.types';

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

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  userId: string;
  sessionId: string;
}

export type TFastifyRequestWithUser = FastifyRequest & { user: IUser };

export type TFastifyRequestWithToken = FastifyRequest & {
  user: IToken;
  originalUser: IUser;
};
