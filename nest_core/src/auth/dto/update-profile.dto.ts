import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Matches } from 'class-validator';

import d from 'locales/dictionary';
import { UpdateUserFields } from 'src/users/users.types';
import { EMAIL_REGEX, NAME_REGEX } from 'libs/constants';

export class UpdateProfileDto implements UpdateUserFields {
  @ApiPropertyOptional({
    example: 'example@mail.com',
    description: d['en'].email,
  })
  @IsOptional()
  @Matches(EMAIL_REGEX)
  email?: string;

  @ApiPropertyOptional({ example: 'Linus Torvalds', description: d['en'].name })
  @IsOptional()
  @Matches(NAME_REGEX)
  @Transform(({ value }) => (value as string).trim())
  name?: string;
}
