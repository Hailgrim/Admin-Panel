import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import lang from 'libs/lang';
import { GetUsersFields } from 'libs/types';
import { PaginationDto } from 'src/database/dto/pagination.dto';

export class GetUsersDto extends PaginationDto implements GetUsersFields {
  @ApiProperty({ example: 'user@mail.com', description: lang.get('en')?.email })
  @IsOptional()
  @IsEmail({}, { message: lang.get('en')?.incorrect(lang.get('en')?.email) })
  @Length(5, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.email, 5, 100),
  })
  email?: string;

  @ApiProperty({ example: 'Linus Torvalds', description: lang.get('en')?.name })
  @IsOptional()
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.name),
  })
  @Length(1, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.name, 1, 100),
  })
  name?: string;

  @ApiProperty({ example: true, description: lang.get('en')?.status })
  @IsOptional()
  @IsBoolean({
    message: lang.get('en')?.mustBeABoolean(lang.get('en')?.status),
  })
  enabled?: boolean;
}
