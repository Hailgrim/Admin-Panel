import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from 'libs/constants';
import { IResetPassword } from '../auth.types';

export class ResetPasswordDto implements IResetPassword {
  @ApiProperty({ type: String, example: 'example@mail.com' })
  @IsString()
  email: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  code: string;

  @ApiProperty({ type: String, example: '!Q1q2w3e4r' })
  @Matches(PASSWORD_REGEX)
  password: string;
}
