import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

import d from 'locales/dictionary';
import { IRolesResources } from 'src/resources/resources.types';

export class RolesResourcesDto implements IRolesResources {
  @ApiProperty({ example: 1, description: d['en'].roleId })
  @IsString()
  roleId: number;

  @ApiProperty({ example: 1, description: d['en'].resourceId })
  @IsString()
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
