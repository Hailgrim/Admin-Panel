import { Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as nodemailer from 'nodemailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { cfg } from 'config/configuration';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        let host = cfg.host;
        let port = cfg.port;
        let secure = port === 587;
        let user = cfg.smtp.user;
        let pass = cfg.smtp.password;

        if (cfg.smtp.test) {
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
            from: cfg.smtp.from,
          },
          preview: cfg.smtp.test,
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
