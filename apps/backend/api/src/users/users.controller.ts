import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ERights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getT, IGetListResponse, IUser, ROUTES } from '@ap/shared';
import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { ExternalUserDto } from './dto/external-user.dto';
import { UsersListDto } from './dto/users-list.dto';
import { UsersRolesQueryItemsDto } from 'src/database/dto/users-roles-query-items.dto';

const route = ROUTES.api.users.substring(1);

@ApiTags(getT().users)
@Controller(route)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: getT().entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalUserDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    const user = await this.usersService.create(createUserDto);
    return plainToInstance(ExternalUserDto, user);
  }

  @ApiOperation({ summary: getT().getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalUserDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<IUser> {
    const user = await this.usersService.getOnePublic(id);
    return plainToInstance(ExternalUserDto, user);
  }

  @ApiOperation({ summary: getT().getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: UsersListDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<IGetListResponse<IUser>> {
    const users = await this.usersService.getList(getUsersDto);
    return plainToInstance(UsersListDto, users);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.usersService.updateFields(id, updateUserDto);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id/roles')
  async updateRoles(
    @Param('id') id: string,
    @Body() usersRolesQueryItemsDto: UsersRolesQueryItemsDto,
  ): Promise<void> {
    await this.usersService.updateRoles(id, usersRolesQueryItemsDto.items);
  }

  @ApiOperation({ summary: getT().deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(
    @Body() QueryItemsDto: QueryItemsDto<IUser['id']>,
  ): Promise<void> {
    await this.usersService.delete(QueryItemsDto.items);
  }
}
