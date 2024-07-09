import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import d from 'locales/dictionary';
import { IRolesResources } from 'src/resources/resources.types';

export class RolesResourcesDto implements IRolesResources {
  @ApiProperty({ example: 1, description: d['en'].roleId })
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].roleId) })
  roleId: number;

  @ApiProperty({ example: 1, description: d['en'].resourceId })
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].resourceId) })
  resourceId: number;

  @ApiProperty({
    example: false,
    description: d['en'].creating,
  })
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].creating),
  })
  creating: boolean;

  @ApiProperty({
    example: false,
    description: d['en'].reading,
  })
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].reading),
  })
  reading: boolean;

  @ApiProperty({
    example: false,
    description: d['en'].updating,
  })
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].updating),
  })
  updating: boolean;

  @ApiProperty({
    example: false,
    description: d['en'].deleting,
  })
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].deleting),
  })
  deleting: boolean;
}
