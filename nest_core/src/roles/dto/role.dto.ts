import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IRole } from '../roles.types';
import { UsersRolesDto } from 'src/database/dto/users-roles.dto';
import { ExternalResourceDto } from 'src/resources/dto/external-resource.dto';

export class RoleDto implements IRole {
  @ApiProperty({
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String, example: 'Member' })
  @Length(1, 100)
  name: string;

  @ApiProperty({ type: String, example: 'Lorem ipsum' })
  @MaxLength(1000)
  description: string;

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  admin: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  default: boolean;

  @ApiProperty({ type: [ExternalResourceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalResourceDto)
  resources: ExternalResourceDto[];

  @ApiProperty({ type: UsersRolesDto })
  @ValidateNested()
  @Type(() => UsersRolesDto)
  UsersRolesModel: UsersRolesDto;
}
