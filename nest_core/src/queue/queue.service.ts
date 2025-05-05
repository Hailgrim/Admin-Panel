import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MAIL_SERVER } from 'libs/constants';

@Injectable()
export class QueueService {
  constructor(
    @Inject(MAIL_SERVER)
    private mailClient: ClientProxy,
  ) {}

  sendEmail(
    options: { method: string },
    payload: Record<string, unknown>,
  ): void {
    try {
      this.mailClient.send(options, payload).subscribe();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
