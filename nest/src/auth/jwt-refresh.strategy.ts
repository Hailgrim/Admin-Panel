import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

import { REFRESH_TOKEN_SECRET_KEY } from 'libs/config';
import { getCookies } from 'libs/functions';

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
    const cookies = headers.cookie ? getCookies(headers.cookie) : undefined;
    return cookies?.refreshToken?.length > 0 ? cookies.refreshToken : null;
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
