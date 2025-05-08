import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

import { IResource, IRole, IRights } from '@ap/shared';

export class RightsDto implements IRights {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  roleId: IRole['id'];

  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  resourceId: IResource['id'];

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  creating: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  reading: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  updating: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  deleting: boolean;
}
