import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { UsersRolesDto } from './users-roles.dto';

export class UsersRolesQueryItemsDto extends QueryItemsDto<UsersRolesDto> {
  @ApiProperty({ type: [UsersRolesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsersRolesDto)
  declare items: UsersRolesDto[];
}
