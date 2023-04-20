import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import lang from 'libs/lang';

export class PaginationDto {
  @ApiProperty({ example: 2, description: lang.get('en')?.page })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber(
    {},
    { message: lang.get('en')?.mustBeANumber(lang.get('en')?.page) },
  )
  page?: number;

  @ApiProperty({ example: 10, description: lang.get('en')?.quantity })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber(
    {},
    { message: lang.get('en')?.mustBeANumber(lang.get('en')?.quantity) },
  )
  quantity?: number;

  @ApiProperty({
    example: false,
    description: lang.get('en')?.isCountingNecessary,
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean({
    message: lang
      .get('en')
      ?.mustBeABoolean(lang.get('en')?.isCountingNecessary),
  })
  count?: boolean;

  @ApiProperty({
    example: 'Linus Torvalds',
    description: lang.get('en')?.searchQuery,
  })
  @IsOptional()
  @IsString({
    message: lang.get('en')?.mustBeAString(lang.get('en')?.searchQuery),
  })
  @Length(1, 100, {
    message: lang.get('en')?.fieldLength(lang.get('en')?.searchQuery, 1, 100),
  })
  search?: string;
}
