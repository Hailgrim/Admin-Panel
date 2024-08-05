import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import d from 'locales/dictionary';
import { GetRolesFields } from '../roles.types';
import { GetListDto } from 'src/database/dto/get-list.dto';

export class GetRolesDto extends GetListDto implements GetRolesFields {
  @ApiPropertyOptional({
    example: 'Admin',
    description: d['en'].name,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Lorem ipsum',
    description: d['en'].description,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true, description: d['en'].status })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  enabled?: boolean;
}
