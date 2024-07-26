import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

import d from 'locales/dictionary';
import { CreateResourceFields } from '../resources.types';

export class CreateResourceDto implements CreateResourceFields {
  @ApiProperty({
    example: 'Users',
    description: d['en'].name,
  })
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  name: string;

  @ApiProperty({
    example: 'users',
    description: d['en'].path,
  })
  @IsString({
    message: d['en'].mustBeAString(d['en'].path),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].path, 1, 100),
  })
  path: string;

  @ApiPropertyOptional({
    example: 'Users resource',
    description: d['en'].description,
  })
  @IsOptional()
  @ValidateIf((o: CreateResourceFields) => !!o.description)
  @Transform(({ value }) => value || null)
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
