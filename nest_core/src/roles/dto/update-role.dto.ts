import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import lang from 'libs/lang';
import { UpdateRoleFields } from 'libs/types';

export class UpdateRoleDto implements UpdateRoleFields {
  @ApiProperty({
    example: 'Client',
    description: lang.get('en')?.name,
  })
  @IsOptional()
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.name),
  })
  @Length(1, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.name, 1, 100),
  })
  name?: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: lang.get('en')?.description,
  })
  @IsOptional()
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.description),
  })
  @Length(1, 1000, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.description, 1, 1000),
  })
  description?: string;

  @ApiProperty({ example: true, description: lang.get('en')?.status })
  @IsOptional()
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.status),
  })
  enabled?: boolean;
}
