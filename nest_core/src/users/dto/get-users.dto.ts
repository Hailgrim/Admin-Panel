import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';

import { GetListRequestDto } from 'src/database/dto/get-list-request.dto';
import { TGetListRequest, TGetUsers } from '@ap/shared';
import { UserDto } from './user.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetUsersDto
  extends IntersectionType(
    GetListRequestDto,
    PartialType(
      PickType<UserDto, keyof TGetUsers>(UserDto, ['name', 'enabled']),
    ),
  )
  implements TGetListRequest<TGetUsers>
{
  @ApiPropertyOptional({ type: String, example: 'example@mail.com' })
  @IsOptional()
  @IsString()
  email: string;
}
