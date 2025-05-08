import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IResource } from '@ap/shared';
import { RightsDto } from 'src/database/dto/rights.dto';

export class ResourceDto implements IResource {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String, example: 'Posts' })
  @Length(1, 100)
  name: string;

  @ApiProperty({ type: String, example: 'posts' })
  @Length(1, 100)
  path: string;

  @ApiProperty({ type: String, example: 'Lorem ipsum' })
  @MaxLength(1000)
  description: string;

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  default: boolean;

  @ApiProperty({ type: RightsDto })
  @ValidateNested()
  @Type(() => RightsDto)
  RightsModel: RightsDto;
}
