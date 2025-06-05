import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { IToken } from './auth.types';
import { cfg } from 'config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors<FastifyRequest>([
        (req) => req.cookies['accessToken'] || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: cfg.tokens.access.secret,
    });
  }

  validate(payload: IToken) {
    return { ...payload };
  }
}
