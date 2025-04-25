import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { getIP } from 'libs/utils';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: FastifyRequest): Promise<string> {
    return Promise.resolve(getIP(req));
  }
}
