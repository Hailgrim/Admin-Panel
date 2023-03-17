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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import lang from 'libs/lang';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { Rights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { IFindAndCount, IUser } from 'libs/types';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRolesDto } from 'src/database/dto/users-roles.dto';

const route = 'users';

@ApiTags(String(lang.get('en')?.users))
@Controller(route)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: lang.get('en')?.entityCreation })
  @ApiResponse({ status: 201, type: IUser })
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

  @ApiOperation({ summary: lang.get('en')?.getEntities })
  @ApiResponse({ status: 200, type: [IUser] })
  @Roles({ path: route, action: Rights.Listing })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async findAll(
    @Req() req: any,
    @Query() getUsersDto: GetUsersDto,
  ): Promise<IUser[] | IFindAndCount<IUser>> {
    if (getUsersDto.count) {
      return this.usersService.findAndCountAllPublic(getUsersDto);
    } else {
      return this.usersService.findAllPublic(getUsersDto);
    }
  }

  @ApiOperation({ summary: lang.get('en')?.getEntity })
  @ApiResponse({ status: 200, type: IUser })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IUser> {
    return this.usersService.findOnePublic(Number(id));
  }

  @ApiOperation({ summary: lang.get('en')?.updateEntity })
  @ApiResponse({ status: 200, type: Boolean })
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

  @ApiOperation({ summary: lang.get('en')?.updateEntity })
  @ApiResponse({ status: 200, type: Boolean })
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

  @ApiOperation({ summary: lang.get('en')?.deleteEntity })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles({ path: route, action: Rights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(Number(id));
  }
}
