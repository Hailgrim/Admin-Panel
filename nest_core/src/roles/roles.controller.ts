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
  create(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<IRole> {
    res.status(HttpStatus.CREATED);
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalRoleDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<IRole> {
    return this.roleService.getOnePublic(id);
  }

  @ApiOperation({ summary: d['en'].getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: RolesListDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  getList(@Query() getRolesDto: GetRolesDto): Promise<IGetListResponse<IRole>> {
    return this.roleService.getListPublic(getRolesDto);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<boolean> {
    return this.roleService.updateFields(id, updateRoleDto);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id/resources')
  updateResources(
    @Param('id') id: string,
    @Body() rightsQueryItemsDta: RightsQueryItemsDto,
  ): Promise<boolean> {
    return this.roleService.updateResources(id, rightsQueryItemsDta.items);
  }

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  delete(@Body() QueryItemsDto: QueryItemsDto<IRole['id']>): Promise<boolean> {
    return this.roleService.delete(QueryItemsDto.items);
  }
}
