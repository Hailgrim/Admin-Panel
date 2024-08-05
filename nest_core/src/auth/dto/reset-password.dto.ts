import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import d from 'locales/dictionary';
import { PASSWORD_REGEX } from 'libs/constants';

export class ResetPasswordDto {
  @ApiProperty({ example: 'example@mail.com', description: d['en'].email })
  @IsString()
  email: string;

  @ApiProperty({
    example: '1234',
    description: d['en'].resetPasswordCode,
  })
  @IsString()
  code: string;

  @ApiProperty({ example: '!Q1q2w3e4r', description: d['en'].password })
  @Matches(PASSWORD_REGEX)
  password: string;
}
