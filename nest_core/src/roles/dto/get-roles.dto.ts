import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import d from 'locales/dictionary';
import { PaginationDto } from 'src/database/dto/pagination.dto';
import { GetRolesFields } from '../roles.types';

export class GetRolesDto extends PaginationDto implements GetRolesFields {
  @ApiProperty({
    example: 'Client',
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

  @ApiProperty({ example: true, description: d['en'].status })
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].status),
  })
  enabled?: boolean;
}
