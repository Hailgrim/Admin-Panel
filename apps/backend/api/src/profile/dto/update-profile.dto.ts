import { PartialType, PickType } from '@nestjs/swagger';

import { UserDto } from 'src/users/dto/user.dto';
import { TUpdateUser } from '@ap/shared/src/types';

export class UpdateProfileDto
  extends PartialType(PickType<UserDto, keyof TUpdateUser>(UserDto, ['name']))
  implements TUpdateUser {}
