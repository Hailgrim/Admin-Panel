import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { EmailCodeDto } from './dto/email-code.dto';
import { IQueuePattern } from '@ap/shared';
import {
  MAIL_CHANGE_EMAIL,
  MAIL_FORGOT_PASSWORD,
  MAIL_REGISTRATION,
} from 'libs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern<IQueuePattern>({ cmd: MAIL_REGISTRATION })
  registration(emailCodeDto: EmailCodeDto) {
    return this.appService.registration(emailCodeDto.email, emailCodeDto.code);
  }

  @MessagePattern<IQueuePattern>({ cmd: MAIL_FORGOT_PASSWORD })
  forgotPassword(emailCodeDto: EmailCodeDto) {
    return this.appService.forgotPassword(
      emailCodeDto.email,
      emailCodeDto.code,
    );
  }

  @MessagePattern<IQueuePattern>({ cmd: MAIL_CHANGE_EMAIL })
  changeEmail(emailCodeDto: EmailCodeDto) {
    return this.appService.changeEmail(emailCodeDto.email, emailCodeDto.code);
  }
}
