import { FastifyRequest } from 'fastify';

import { IUser } from 'src/users/users.types';

export abstract class ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  userId: string;
  sessionId: string;
  sessionPayload: string;
}

export type FastifyRequestWithUser = FastifyRequest & { user: IUser };

export type FastifyRequestWithToken = FastifyRequest & {
  user: IToken;
  originalUser: IUser;
};

export abstract class ISession {
  payload: string;
  expires: Date;
  userId: string;
  userAgent?: string;
  ip: string;
  updatedAt: Date;
}

export type SignUpFields = Pick<IUser, 'email' | 'password' | 'name'>;
