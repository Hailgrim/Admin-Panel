import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import d from 'locales/dictionary';
import { IRolesResources } from '../database.types';

export class RolesResourcesDto implements IRolesResources {
  @ApiProperty({ example: 1, description: d['en'].roleId })
  @IsNumber()
  roleId: number;

  @ApiProperty({ example: 1, description: d['en'].resourceId })
  @IsNumber()
  resourceId: number;

  @ApiProperty({
    example: false,
    description: d['en'].creating,
  })
  @IsBoolean()
  creating: boolean;

  @ApiProperty({
    example: false,
    description: d['en'].reading,
  })
  @IsBoolean()
  reading: boolean;

  @ApiProperty({
    example: false,
    description: d['en'].updating,
  })
  @IsBoolean()
  updating: boolean;

  @ApiProperty({
    example: false,
    description: d['en'].deleting,
  })
  @IsBoolean()
  deleting: boolean;
}
