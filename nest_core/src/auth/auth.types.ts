import { FastifyRequest } from 'fastify';

import { IUser } from 'src/users/users.types';

export abstract class ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  userId: string;
  sessionId: string;
  sessionHash: string;
}

export type FastifyRequestWithUser = FastifyRequest & { user: IUser };

export type FastifyRequestWithToken = FastifyRequest & { user: IToken };

export abstract class ISession {
  userId: string;
  hash: string;
  expires: Date;
}

export type SignUpFields = Pick<IUser, 'email' | 'password' | 'name'>;
