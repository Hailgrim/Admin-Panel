import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { TGetListRequest } from '@ap/shared';
export class GetListRequestDto implements TGetListRequest {
  @ApiPropertyOptional({ type: Number, example: 2 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false })
  reqPage?: number;

  @ApiPropertyOptional({ type: Number, example: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false })
  reqLimit?: number;

  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  reqCount?: boolean;
}
