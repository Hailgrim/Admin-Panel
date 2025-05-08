import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Matches } from 'class-validator';

import { NAME_REGEX, TUpdateUser } from '@ap/shared';

export class UpdateProfileDto implements TUpdateUser {
  @ApiPropertyOptional({ type: String, example: 'Linus Torvalds' })
  @IsOptional()
  @Matches(NAME_REGEX)
  @Transform(({ value }) => (value as string).trim())
  name?: string;
}
