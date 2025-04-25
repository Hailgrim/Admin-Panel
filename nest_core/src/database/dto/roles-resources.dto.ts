import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import d from 'locales/dictionary';
import { IRolesResources } from '../database.types';

export class RolesResourcesDto implements IRolesResources {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: d['en'].roleId,
  })
  @IsNumber()
  roleId: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: d['en'].resourceId,
  })
  @IsNumber()
  resourceId: string;

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
