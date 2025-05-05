import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { RightsDto } from './rights.dto';

export class RightsQueryItemsDto extends QueryItemsDto<RightsDto> {
  @ApiProperty({ type: [RightsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RightsDto)
  declare items: RightsDto[];
}
