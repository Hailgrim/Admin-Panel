import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import d from 'locales/dictionary';
import { CreateRoleFields } from '../roles.types';

export class CreateRoleDto implements CreateRoleFields {
  @ApiProperty({
    example: 'Client',
    description: d['en'].name,
  })
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  name: string;

  @ApiPropertyOptional({
    example: 'user@mail.com',
    description: d['en'].description,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].description),
  })
  @Length(1, 1000, {
    message: d['en'].fieldLength(d['en'].description, 1, 1000),
  })
  description?: string | null;

  @ApiProperty({ example: true, description: d['en'].status })
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].status),
  })
  enabled: boolean;
}
