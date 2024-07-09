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
  async create(
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
  async findAll(
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
  async findOne(@Param('id') id: string): Promise<IUser> {
    return this.usersService.findOnePublic(Number(id));
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    const result = await this.usersService.updateFields(
      Number(id),
      updateUserDto,
    );
    if (!result) {
      res.status(HttpStatus.NO_CONTENT);
    }
    return result;
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id/roles')
  async updateRoles(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('id') id: string,
    @Body() usersRolesDtoArr: UsersRolesDto[],
  ): Promise<boolean> {
    const result = await this.usersService.updateRoles(
      Number(id),
      usersRolesDtoArr,
    );
    if (!result) {
      res.status(HttpStatus.NO_CONTENT);
    }
    return result;
  }

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(@Body() id: number | number[]): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
