import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { EmailCodeDto } from './dto/email-code.dto';
import { IQueuePattern } from '@ap/shared';
import { cfg } from 'config/configuration';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern<IQueuePattern>({ cmd: cfg.rmq.cmd.registration })
  registration(@Payload() emailCodeDto: EmailCodeDto) {
    return this.appService.registration(emailCodeDto.email, emailCodeDto.code);
  }

  @MessagePattern<IQueuePattern>({ cmd: cfg.rmq.cmd.forgotPassword })
  forgotPassword(@Payload() emailCodeDto: EmailCodeDto) {
    return this.appService.forgotPassword(
      emailCodeDto.email,
      emailCodeDto.code,
    );
  }

  @MessagePattern<IQueuePattern>({ cmd: cfg.rmq.cmd.changeEmail })
  changeEmail(@Payload() emailCodeDto: EmailCodeDto) {
    return this.appService.changeEmail(emailCodeDto.email, emailCodeDto.code);
  }
}
