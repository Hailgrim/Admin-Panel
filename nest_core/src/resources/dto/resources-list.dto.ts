import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { GetListResponseDto } from 'src/database/dto/get-list-response.dto';
import { ExternalResourceDto } from './external-resource.dto';

export class ResourcesListDto extends GetListResponseDto<ExternalResourceDto> {
  @ApiProperty({ type: [ExternalResourceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalResourceDto)
  declare rows: ExternalResourceDto[];
}
