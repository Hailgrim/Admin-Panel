import { Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as nodemailer from 'nodemailer';

import {
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_TEST,
  MAIL_USER,
} from 'libs/config';
import { MailService } from './mail.service';

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
          dir: `${process.cwd()}/src/mail/templates`,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      });
    })(),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
