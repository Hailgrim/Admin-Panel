import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { ACCESS_TOKEN_SECRET_KEY } from 'libs/config';
import { IToken } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors<FastifyRequest>([
        (req) => req.cookies['accessToken'] || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET_KEY,
    });
  }

  validate(payload: IToken) {
    return { ...payload };
  }
}
