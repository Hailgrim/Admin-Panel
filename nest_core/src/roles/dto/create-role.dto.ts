import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Length, MaxLength } from 'class-validator';

import d from 'locales/dictionary';
import { CreateRoleFields } from '../roles.types';

export class CreateRoleDto implements CreateRoleFields {
  @ApiProperty({
    example: 'Admin',
    description: d['en'].name,
  })
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'Lorem ipsum',
    description: d['en'].description,
  })
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: true, description: d['en'].status })
  @IsBoolean()
  enabled: boolean;
}
