import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { IToken } from './auth.types';
import { cfg } from 'config/configuration';

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
      secretOrKey: cfg.tokens.refresh.secret,
    });
  }

  validate(payload: IToken) {
    return { ...payload };
  }
}
