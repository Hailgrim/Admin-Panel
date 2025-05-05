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
import { ERights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import d from 'locales/dictionary';
import { IGetListResponse } from 'src/database/database.types';
import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { IUser } from './users.types';
import { ExternalUserDto } from './dto/external-user.dto';
import { UsersListDto } from './dto/users-list.dto';
import { UsersRolesQueryItemsDto } from 'src/database/dto/users-roles-query-items.dto';

const route = 'users';

@ApiTags(d['en'].users)
@Controller(route)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: d['en'].entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @Roles({ path: route, action: ERights.Creating })
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
  @ApiResponse({ status: HttpStatus.OK, type: UsersListDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  findAll(@Query() getUsersDto: GetUsersDto): Promise<IGetListResponse<IUser>> {
    return this.usersService.findAllPublic(getUsersDto);
  }

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalUserDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<IUser> {
    return this.usersService.findOnePublic(id);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
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
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id/roles')
  updateRoles(
    @Param('id') id: string,
    @Body() usersRolesQueryItemsDto: UsersRolesQueryItemsDto,
  ): Promise<boolean> {
    return this.usersService.updateRoles(id, usersRolesQueryItemsDto.items);
  }

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  delete(@Body() QueryItemsDto: QueryItemsDto<IUser['id']>): Promise<boolean> {
    return this.usersService.delete(QueryItemsDto.items);
  }
}
