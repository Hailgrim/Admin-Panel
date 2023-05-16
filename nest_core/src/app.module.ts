import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ResourcesModule } from './resources/resources.module';
import { ThrottlerBehindProxyGuard } from './auth/throttler-behind-proxy.guard';
import { RMQ_HOST, RMQ_PASSWORD, RMQ_PORT, RMQ_USER } from 'libs/config';
import { MAIL_SERVER } from 'libs/constants';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),

    ClientsModule.register([
      {
        name: MAIL_SERVER,
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${RMQ_USER}:${RMQ_PASSWORD}@${RMQ_HOST}:${RMQ_PORT}`],
          queue: 'mail_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),

    AuthModule,
    UsersModule,
    RolesModule,
    ResourcesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
