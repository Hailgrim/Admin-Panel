import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

import d from 'locales/dictionary';
import { SignUpFields } from '../auth.types';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from 'libs/constants';

export class SignUpDto implements SignUpFields {
  @ApiProperty({ example: 'user@mail.com', description: d['en'].email })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: d['en'].incorrect(d['en'].email) })
  @Length(5, 100, {
    message: d['en'].fieldLength(d['en'].email, 5, 100),
  })
  @Matches(EMAIL_REGEX)
  email: string;

  @ApiProperty({ example: '1q2w3e4r5', description: d['en'].password })
  @IsStrongPassword({}, { message: d['en'].mustBeAStrong(d['en'].password) })
  @Length(10, 100, {
    message: d['en'].fieldLength(d['en'].password, 10, 100),
  })
  @Matches(PASSWORD_REGEX)
  password: string;

  @ApiProperty({ example: 'Linus Torvalds', description: d['en'].name })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  @Matches(NAME_REGEX)
  name: string;
}
