import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { QueueService } from './queue.service';
import {
  RMQ_HOST,
  RMQ_MAIL_QUEUE,
  RMQ_PASSWORD,
  RMQ_PORT,
  RMQ_USER,
} from 'libs/config';
import { MAIL_SERVER } from 'libs/constants';

@Module({
  providers: [
    {
      provide: MAIL_SERVER,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${RMQ_USER}:${RMQ_PASSWORD}@${RMQ_HOST}:${RMQ_PORT}`,
            ],
            queue: RMQ_MAIL_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
    QueueService,
  ],
  exports: [QueueService],
})
export class QueueModule {}
