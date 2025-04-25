import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import {
  MAIL_CHANGE_EMAIL,
  MAIL_FORGOT_PASSWORD,
  MAIL_REGISTRATION,
} from 'libs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ method: MAIL_REGISTRATION })
  registration(registrationDto: RegistrationDto) {
    return this.appService.registration(registrationDto);
  }

  @MessagePattern({ method: MAIL_FORGOT_PASSWORD })
  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.appService.forgotPassword(forgotPasswordDto);
  }

  @MessagePattern({ method: MAIL_CHANGE_EMAIL })
  changeEmail(changeEmailDto: ChangeEmailDto) {
    return this.appService.changeEmail(changeEmailDto);
  }
}
