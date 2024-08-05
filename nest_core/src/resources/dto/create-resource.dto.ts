import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Length, MaxLength } from 'class-validator';

import d from 'locales/dictionary';
import { CreateResourceFields } from '../resources.types';

export class CreateResourceDto implements CreateResourceFields {
  @ApiProperty({
    example: 'Users',
    description: d['en'].name,
  })
  @Length(1, 100)
  name: string;

  @ApiProperty({
    example: 'users',
    description: d['en'].path,
  })
  @Length(1, 100)
  path: string;

  @ApiPropertyOptional({
    example: 'Users resource',
    description: d['en'].description,
  })
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: true, description: d['en'].status })
  @IsBoolean()
  enabled: boolean;
}
