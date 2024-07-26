import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { NAME_REGEX } from 'libs/constants';

import d from 'locales/dictionary';
import { UpdateUserFields } from 'src/users/users.types';

export class UpdateProfileDto implements UpdateUserFields {
  @ApiPropertyOptional({ example: 'Linus Torvalds', description: d['en'].name })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  @Matches(NAME_REGEX)
  name?: string;
}
