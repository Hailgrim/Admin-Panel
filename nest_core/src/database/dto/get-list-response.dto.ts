import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

import { IGetListResponse } from '../database.types';

export class GetListResponseDto<T> implements IGetListResponse<T> {
  @ApiProperty({ type: Array })
  @IsArray()
  rows: T[];

  @ApiPropertyOptional({ type: Number, example: 100 })
  @IsOptional()
  @IsNumber({ allowNaN: false })
  count?: number;
}
