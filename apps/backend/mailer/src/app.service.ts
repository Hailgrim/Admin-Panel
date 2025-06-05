import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { d } from '@ap/shared';
import { cfg } from 'config/configuration';
import { ETemplates } from 'libs/constants';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  async registration(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: cfg.smtp.from,
        subject: d['en'].subjectRegistration,
        template: ETemplates.Registration,
        context: {
          host: cfg.host,
          title: d['en'].subjectRegistration,
          action: d['en'].verificationCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (cfg.smtp.test) {
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async forgotPassword(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: cfg.smtp.from,
        subject: d['en'].subjectForgotPassword,
        template: ETemplates.ForgotPassword,
        context: {
          host: cfg.host,
          title: d['en'].subjectForgotPassword,
          action: d['en'].resetPasswordCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (cfg.smtp.test) {
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async changeEmail(email: string, code: string): Promise<void> {
    try {
      const info = (await this.mailerService.sendMail({
        to: email,
        from: cfg.smtp.from,
        subject: d['en'].subjectChangeEmail,
        template: ETemplates.ChangeEmail,
        context: {
          host: cfg.host,
          title: d['en'].subjectChangeEmail,
          action: d['en'].changeEmailCode,
          code,
        },
      })) as SMTPTransport.SentMessageInfo;

      if (cfg.smtp.test) {
        Logger.log(nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
