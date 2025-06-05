import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { GetListResponseDto } from 'src/database/dto/get-list-response.dto';
import { ExternalUserDto } from './external-user.dto';

export class UsersListDto extends GetListResponseDto<ExternalUserDto> {
  @ApiProperty({ type: [ExternalUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalUserDto)
  declare rows: ExternalUserDto[];
}
