import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { QueueService } from './queue.service';
import { MAIL_SERVER } from 'libs/constants';
import { cfg } from 'config/configuration';

@Module({
  providers: [
    {
      provide: MAIL_SERVER,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${cfg.rmq.user}:${cfg.rmq.password}@${cfg.rmq.host}:${cfg.rmq.port}`,
            ],
            queue: cfg.rmq.mailQueue,
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
