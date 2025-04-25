import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { REFRESH_TOKEN_SECRET_KEY } from 'libs/config';
import { IToken } from './auth.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors<FastifyRequest>([
        (req) => req.cookies['refreshToken'] || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: REFRESH_TOKEN_SECRET_KEY,
    });
  }

  validate(payload: IToken) {
    return { ...payload };
  }
}
