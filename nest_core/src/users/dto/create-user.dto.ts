import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

import d from 'locales/dictionary';
import { CreateUserFields } from '../users.types';

export class CreateUserDto implements CreateUserFields {
  @ApiProperty({ example: 'user@mail.com', description: d['en'].email })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: d['en'].incorrect(d['en'].email) })
  @Length(5, 100, {
    message: d['en'].fieldLength(d['en'].email, 5, 100),
  })
  email: string;

  @ApiProperty({ example: '!Q1q2w3e4r', description: d['en'].password })
  @IsStrongPassword({}, { message: d['en'].mustBeAStrong(d['en'].password) })
  @Length(10, 100, {
    message: d['en'].fieldLength(d['en'].password, 10, 100),
  })
  password: string;

  @ApiProperty({ example: 'Linus Torvalds', description: d['en'].name })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  name: string;

  @ApiProperty({ example: true, description: d['en'].status })
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].status),
  })
  enabled: boolean;
}
