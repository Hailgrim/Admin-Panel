import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import d from 'locales/dictionary';
import { PaginationDto } from 'src/database/dto/pagination.dto';
import { GetResourcesFields } from '../resources.types';

export class GetResourcesDto
  extends PaginationDto
  implements GetResourcesFields
{
  @ApiProperty({
    example: 'Users',
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

  @ApiProperty({
    example: 'users',
    description: d['en'].path,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].path),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].path, 1, 100),
  })
  path?: string;

  @ApiProperty({
    example: 'Users resource',
    description: d['en'].description,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].description),
  })
  @Length(1, 1000, {
    message: d['en'].fieldLength(d['en'].description, 1, 1000),
  })
  description?: string | null;

  @ApiProperty({ example: true, description: d['en'].status })
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].status),
  })
  enabled?: boolean;
}
