import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Length, MaxLength } from 'class-validator';

import d from 'locales/dictionary';
import { UpdateResourceFields } from '../resources.types';

export class UpdateResourceDto implements UpdateResourceFields {
  @ApiPropertyOptional({
    example: 'Resources',
    description: d['en'].name,
  })
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @ApiPropertyOptional({
    example: 'resources',
    description: d['en'].path,
  })
  @IsOptional()
  @Length(1, 100)
  path?: string;

  @ApiPropertyOptional({
    example: 'Lorem ipsum',
    description: d['en'].description,
  })
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: true, description: d['en'].status })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
