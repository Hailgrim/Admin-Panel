import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import d from 'locales/dictionary';
import { EMAIL_REGEX } from 'libs/constants';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'example@mail.com', description: d['en'].email })
  @Matches(EMAIL_REGEX)
  email: string;

  @ApiProperty({
    example: '1234',
    description: d['en'].resetPasswordCode,
  })
  @IsString()
  code: string;
}
