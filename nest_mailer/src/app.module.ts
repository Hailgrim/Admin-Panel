import { Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as nodemailer from 'nodemailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  HOST,
  MAIL_FROM,
  MAIL_PASSWORD,
  MAIL_TEST,
  MAIL_USER,
  PORT,
} from 'libs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        let host = HOST;
        let port = PORT;
        let secure = port === 587;
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

        return {
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
            dir: `${process.cwd()}/templates`,
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
