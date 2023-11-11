import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

import { ACCESS_TOKEN_SECRET_KEY } from 'libs/config';
import { getCookies } from 'libs/functions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => JwtStrategy.extractJWT(req.headers),
      ]),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_SECRET_KEY,
    });
  }

  private static extractJWT(headers: IncomingHttpHeaders): string | null {
    const cookies = getCookies(headers.cookie);
    if (cookies?.['accessToken']?.length > 0) {
      return cookies['accessToken'];
    }
    return null;
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
