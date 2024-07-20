import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import d from 'locales/dictionary';
import { UpdateResourceFields } from '../resources.types';

export class UpdateResourceDto implements UpdateResourceFields {
  @ApiPropertyOptional({
    example: 'Users',
    description: d['en'].name,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'users',
    description: d['en'].path,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].path),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].path, 1, 100),
  })
  path?: string;

  @ApiPropertyOptional({
    example: 'Users resource',
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

  @ApiPropertyOptional({ example: true, description: d['en'].status })
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].status),
  })
  enabled?: boolean;
}
