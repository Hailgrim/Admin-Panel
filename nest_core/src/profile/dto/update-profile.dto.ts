import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Matches } from 'class-validator';

import { TUpdateUser } from 'src/users/users.types';
import { NAME_REGEX } from 'libs/constants';

export class UpdateProfileDto implements TUpdateUser {
  @ApiPropertyOptional({ type: String, example: 'Linus Torvalds' })
  @IsOptional()
  @Matches(NAME_REGEX)
  @Transform(({ value }) => (value as string).trim())
  name?: string;
}
