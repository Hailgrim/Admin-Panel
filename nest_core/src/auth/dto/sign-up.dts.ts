import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

import d from 'locales/dictionary';
import { SignUpFields } from '../auth.types';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from 'libs/constants';

export class SignUpDto implements SignUpFields {
  @ApiProperty({ example: 'example@mail.com', description: d['en'].email })
  @Matches(EMAIL_REGEX)
  email: string;

  @ApiProperty({ example: '!Q1q2w3e4r', description: d['en'].password })
  @Matches(PASSWORD_REGEX)
  password: string;

  @ApiProperty({ example: 'Linus Torvalds', description: d['en'].name })
  @Matches(NAME_REGEX)
  @Transform(({ value }) => (value as string).trim())
  name: string;
}
