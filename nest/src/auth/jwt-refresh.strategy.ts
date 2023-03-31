import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

import { PROJECT_TAG, REFRESH_TOKEN_SECRET_KEY } from 'libs/config';
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
    const cookies = getCookies(headers.cookie);
    if (cookies?.[`${PROJECT_TAG}_refreshToken`]?.length > 0) {
      return cookies[`${PROJECT_TAG}_refreshToken`];
    }
    return null;
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
