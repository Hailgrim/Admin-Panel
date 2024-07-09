import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import d from 'locales/dictionary';
import { PaginationDto } from 'src/database/dto/pagination.dto';
import { GetUsersFields } from '../users.types';

export class GetUsersDto extends PaginationDto implements GetUsersFields {
  @ApiProperty({ example: 'user@mail.com', description: d['en'].email })
  @IsOptional()
  @IsEmail({}, { message: d['en'].incorrect(d['en'].email) })
  @Length(5, 100, {
    message: d['en'].fieldLength(d['en'].email, 5, 100),
  })
  email?: string;

  @ApiProperty({ example: 'Linus Torvalds', description: d['en'].name })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].name),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].name, 1, 100),
  })
  name?: string;

  @ApiProperty({ example: true, description: d['en'].status })
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].status),
  })
  enabled?: boolean;
}
