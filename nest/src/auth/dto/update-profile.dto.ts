import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

import lang from 'libs/lang';
import { UpdateUserFields } from 'libs/types';

export class UpdateProfileDto implements UpdateUserFields {
  @ApiProperty({ example: 'Linus Torvalds', description: lang.get('en')?.name })
  @IsOptional()
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.name),
  })
  @Length(1, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.name, 1, 100),
  })
  name?: string;
}
