import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import d from 'locales/dictionary';

export class GetListDto {
  @ApiPropertyOptional({ example: 2, description: d['en'].page })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: d['en'].quantity })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false })
  quantity?: number;

  @ApiPropertyOptional({
    example: false,
    description: d['en'].isCountingNecessary,
  })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  count?: boolean;

  @ApiPropertyOptional({
    example: 'Linus Torvalds',
    description: d['en'].searchQuery,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
