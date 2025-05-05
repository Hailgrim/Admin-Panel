import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { GetListResponseDto } from 'src/database/dto/get-list-response.dto';
import { ExternalRoleDto } from './external-role.dto';

export class RolesListDto extends GetListResponseDto<ExternalRoleDto> {
  @ApiProperty({ type: [ExternalRoleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalRoleDto)
  declare rows: ExternalRoleDto[];
}
