import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import d from 'locales/dictionary';

export class GetListDto {
  @ApiProperty({ example: 2, description: d['en'].page })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].page) })
  page?: number;

  @ApiProperty({ example: 10, description: d['en'].quantity })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].quantity) })
  quantity?: number;

  @ApiProperty({
    example: false,
    description: d['en'].isCountingNecessary,
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].isCountingNecessary),
  })
  count?: boolean;

  @ApiProperty({
    example: 'Linus Torvalds',
    description: d['en'].searchQuery,
  })
  @IsOptional()
  @IsString({
    message: d['en'].mustBeAString(d['en'].searchQuery),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].searchQuery, 1, 100),
  })
  search?: string;
}
