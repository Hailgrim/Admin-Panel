import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

import d from 'locales/dictionary';

export class GetListDto {
  @ApiPropertyOptional({ example: 2, description: d['en'].page })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].page) })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: d['en'].quantity })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber({}, { message: d['en'].mustBeANumber(d['en'].quantity) })
  quantity?: number;

  @ApiPropertyOptional({
    example: false,
    description: d['en'].isCountingNecessary,
  })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean({
    message: d['en'].mustBeABoolean(d['en'].isCountingNecessary),
  })
  count?: boolean;

  @ApiPropertyOptional({
    example: 'Linus Torvalds',
    description: d['en'].searchQuery,
  })
  @IsOptional()
  @ValidateIf((o: GetListDto) => !!o.search)
  @IsString({
    message: d['en'].mustBeAString(d['en'].searchQuery),
  })
  @Length(1, 100, {
    message: d['en'].fieldLength(d['en'].searchQuery, 1, 100),
  })
  search?: string;
}
