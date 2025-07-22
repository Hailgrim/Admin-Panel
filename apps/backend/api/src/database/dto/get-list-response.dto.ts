import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

import { IGetListResponse } from '@ap/shared/src/types';

export class GetListResponseDto<T> implements IGetListResponse<T> {
  @ApiProperty({ type: Array })
  @IsArray()
  rows: T[];

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber({ allowNaN: false })
  page: number;

  @ApiProperty({ type: Number, example: 10 })
  @IsNumber({ allowNaN: false })
  limit: number;

  @ApiPropertyOptional({ type: Number, example: 100 })
  @IsOptional()
  @IsNumber({ allowNaN: false })
  count?: number;
}
