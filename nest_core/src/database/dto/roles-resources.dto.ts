import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import lang from 'libs/lang';
import { IRolesResources } from 'libs/types';

export class RolesResourcesDto implements IRolesResources {
  @ApiProperty({ example: 1, description: lang.get('en')?.roleId })
  @IsNumber(
    {},
    { message: lang.get('en')?.mustBeANumber(lang.get('en')?.roleId) },
  )
  roleId: number;

  @ApiProperty({ example: 1, description: lang.get('en')?.resourceId })
  @IsNumber(
    {},
    { message: lang.get('en')?.mustBeANumber(lang.get('en')?.resourceId) },
  )
  resourceId: number;

  @ApiProperty({
    example: false,
    description: lang.get('en')?.creating,
  })
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.creating),
  })
  creating: boolean;

  @ApiProperty({
    example: false,
    description: lang.get('en')?.reading,
  })
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.reading),
  })
  reading: boolean;

  @ApiProperty({
    example: false,
    description: lang.get('en')?.updating,
  })
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.updating),
  })
  updating: boolean;

  @ApiProperty({
    example: false,
    description: lang.get('en')?.deleting,
  })
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.deleting),
  })
  deleting: boolean;
}
