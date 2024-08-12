import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { Rights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRolesDto } from 'src/database/dto/users-roles.dto';
import d from 'locales/dictionary';
import { IUser } from './users.types';
import { IFindAndCount } from 'src/database/database.types';

const route = 'users';

@ApiTags(d['en'].users)
@Controller(route)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: d['en'].entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: IUser })
  @Roles({ path: route, action: Rights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  create(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUser> {
    res.status(HttpStatus.CREATED);
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: d['en'].getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: [IUser] })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  findAll(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<IUser[] | IFindAndCount<IUser>> {
    if (getUsersDto.count) {
      return this.usersService.findAndCountAllPublic(getUsersDto);
    } else {
      return this.usersService.findAllPublic(getUsersDto);
    }
  }

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: IUser })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<IUser> {
    return this.usersService.findOnePublic(id);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.usersService.updateFields(id, updateUserDto);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id/roles')
  updateRoles(
    @Param('id') id: string,
    @Body() usersRolesDtoArr: UsersRolesDto[],
  ): Promise<boolean> {
    return this.usersService.updateRoles(id, usersRolesDtoArr);
  }

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  delete(@Body() ids: string[]): Promise<boolean> {
    return this.usersService.delete(ids);
  }
}
