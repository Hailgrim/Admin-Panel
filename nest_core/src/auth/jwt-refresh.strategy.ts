import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

import { REFRESH_TOKEN_SECRET_KEY } from 'libs/config';
import { getCookies } from './auth.utils';
import { IToken } from './auth.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => JwtRefreshStrategy.extractRefreshJWT(req.headers),
      ]),
      ignoreExpiration: false,
      secretOrKey: REFRESH_TOKEN_SECRET_KEY,
    });
  }

  private static extractRefreshJWT(
    headers: IncomingHttpHeaders,
  ): string | null {
    const cookies = getCookies(headers.cookie);

    if (cookies['refreshToken']?.length > 0) {
      return cookies['refreshToken'];
    }

    return null;
  }

  async validate(payload: IToken) {
    return { ...payload };
  }
}
