import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import d from 'locales/dictionary';
import { GetRolesFields } from '../roles.types';
import { GetListDto } from 'src/database/dto/get-list.dto';

export class GetRolesDto extends GetListDto implements GetRolesFields {
  @ApiPropertyOptional({
    example: 'Admin',
    description: d['en'].name,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'user@mail.com',
    description: d['en'].description,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].description),
  })
  @Length(1, 1000, {
    message: d['en'].fieldLength(d['en'].description, 1, 1000),
  })
  description?: string;

  @ApiPropertyOptional({ example: true, description: d['en'].status })
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].status),
  })
  enabled?: boolean;
}
