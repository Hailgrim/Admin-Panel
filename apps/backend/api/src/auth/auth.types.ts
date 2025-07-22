import { FastifyRequest } from 'fastify';

import { IUser } from '@ap/shared/src/types';

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  userId: string;
  sessionId: string;
  sign?: string;
}

export type TFastifyRequestWithUser = FastifyRequest & { user: IUser };

export type TFastifyRequestWithToken = FastifyRequest & {
  user: IToken;
  originalUser: IUser;
};
