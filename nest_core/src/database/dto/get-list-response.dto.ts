import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

import { IGetListResponse } from '@ap/shared';

export class GetListResponseDto<T> implements IGetListResponse<T> {
  @ApiProperty({ type: Array })
  @IsArray()
  rows: T[];

  @ApiPropertyOptional({ type: Number, example: 100 })
  @IsOptional()
  @IsNumber({ allowNaN: false })
  count?: number;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber({ allowNaN: false })
  page?: number;

  @ApiPropertyOptional({ type: Number, example: 10 })
  @IsOptional()
  @IsNumber({ allowNaN: false })
  limit?: number;
}
