import { Logger, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { APP_GUARD } from '@nestjs/core';
import * as nodemailer from 'nodemailer';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ResourcesModule } from './resources/resources.module';
import { ThrottlerBehindProxyGuard } from './auth/throttler-behind-proxy.guard';
import {
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_TEST,
  MAIL_USER,
} from 'libs/config';

@Module({
  imports: [
    (async () => {
      let host = MAIL_HOST;
      let port = MAIL_PORT;
      let secure = MAIL_PORT == 465;
      let user = MAIL_USER;
      let pass = MAIL_PASSWORD;

      if (MAIL_TEST) {
        const testMailAccount = await nodemailer.createTestAccount();
        Logger.log(testMailAccount);
        host = testMailAccount.smtp.host;
        port = testMailAccount.smtp.port;
        secure = testMailAccount.smtp.secure;
        user = testMailAccount.user;
        pass = testMailAccount.pass;
      }

      return MailerModule.forRoot({
        transport: {
          host,
          port,
          secure,
          auth: {
            user,
            pass,
          },
        },
        defaults: {
          from: MAIL_FROM,
        },
        preview: MAIL_TEST,
        template: {
          dir: `${process.cwd()}/mail`,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      });
    })(),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 25,
    }),

    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    ResourcesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
