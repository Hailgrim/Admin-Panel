import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { MAIL_SERVER } from 'libs/constants';
import { RMQ_HOST, RMQ_PASSWORD, RMQ_PORT, RMQ_USER } from 'libs/config';

export const rmqProviders = [
  {
    provide: MAIL_SERVER,
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${RMQ_USER}:${RMQ_PASSWORD}@${RMQ_HOST}:${RMQ_PORT}`],
          queue: 'mail_queue',
          queueOptions: {
            durable: false,
          },
        },
      });
    },
  },
];
