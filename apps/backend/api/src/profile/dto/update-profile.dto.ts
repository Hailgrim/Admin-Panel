import { PartialType, PickType } from '@nestjs/swagger';

import { TUpdateUser } from '@ap/shared';
import { UserDto } from 'src/users/dto/user.dto';

export class UpdateProfileDto
  extends PartialType(PickType<UserDto, keyof TUpdateUser>(UserDto, ['name']))
  implements TUpdateUser {}
