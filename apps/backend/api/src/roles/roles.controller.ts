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
import { plainToInstance } from 'class-transformer';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { ERights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetRolesDto } from './dto/get-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { d, IGetListResponse, IRole, ROUTES } from '@ap/shared';
import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { ExternalRoleDto } from './dto/external-role.dto';
import { RolesListDto } from './dto/roles-list.dto';
import { RightsQueryItemsDto } from 'src/database/dto/rights-query-items.dto';

const route = ROUTES.api.roles.substring(1);

@ApiTags(d['en'].roles)
@Controller(route)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: d['en'].entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalRoleDto })
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IRole> {
    res.status(HttpStatus.CREATED);
    const role = await this.roleService.create(createRoleDto);
    return plainToInstance(ExternalRoleDto, role);
  }

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalRoleDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async getOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IRole> {
    res.status(HttpStatus.OK);
    const role = await this.roleService.getOne(id);
    return plainToInstance(ExternalRoleDto, role);
  }

  @ApiOperation({ summary: d['en'].getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: RolesListDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() getRolesDto: GetRolesDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IGetListResponse<IRole>> {
    res.status(HttpStatus.OK);
    const roles = await this.roleService.getList(getRolesDto);
    return plainToInstance(RolesListDto, roles);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id/rights')
  async updateRights(
    @Param('id') id: string,
    @Body() rightsQueryItemsDta: RightsQueryItemsDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.roleService.updateRights(id, rightsQueryItemsDta.items);
  }

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(
    @Body() QueryItemsDto: QueryItemsDto<IRole['id']>,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.roleService.delete(QueryItemsDto.items);
  }
}
