import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

import d from 'locales/dictionary';
import { CreateUserFields } from '../users.types';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from 'libs/constants';

export class CreateUserDto implements CreateUserFields {
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

  @ApiProperty({ example: true, description: d['en'].status })
  @IsBoolean()
  enabled: boolean;
}
