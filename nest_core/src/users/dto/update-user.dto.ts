import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

import d from 'locales/dictionary';
import { UpdateUserFields } from '../users.types';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from 'libs/constants';

export class UpdateUserDto implements UpdateUserFields {
  @ApiPropertyOptional({
    example: 'example@mail.com',
    description: d['en'].email,
  })
  @IsOptional()
  @Matches(EMAIL_REGEX)
  email?: string;

  @ApiPropertyOptional({ example: '!Q1q2w3e4r', description: d['en'].password })
  @IsOptional()
  @Matches(PASSWORD_REGEX)
  password?: string;

  @ApiPropertyOptional({ example: 'Linus Torvalds', description: d['en'].name })
  @IsOptional()
  @Matches(NAME_REGEX)
  @Transform(({ value }) => (value as string).trim())
  name?: string;

  @ApiPropertyOptional({ example: true, description: d['en'].status })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
