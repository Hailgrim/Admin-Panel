import { FastifyRequest } from 'fastify';

import { IUser } from 'src/users/users.types';

export abstract class ITokensResponse {
  accessToken: string;
  refreshToken: string;
}

export abstract class ICookiesResponse extends ITokensResponse {
  sessionId: number;
}

export interface IRequestUser {
  id: number;
  email: string;
  sessionId: number;
  sessionHash: string;
}
export type FastifyRequestWithUser = FastifyRequest & { user: IUser };
export type FastifyRequestWithAuth = FastifyRequest & { user: IRequestUser };

export abstract class ISession {
  userId: number;
  hash: string;
  expires: Date;
}

export type SignUpFields = Pick<IUser, 'email' | 'password' | 'name'>;
