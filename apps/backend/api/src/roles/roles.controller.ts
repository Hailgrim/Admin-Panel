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

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { ERights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetRolesDto } from './dto/get-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { ExternalRoleDto } from './dto/external-role.dto';
import { RolesListDto } from './dto/roles-list.dto';
import { RightsQueryItemsDto } from 'src/database/dto/rights-query-items.dto';
import { ROUTES } from '@ap/shared/src/libs';
import { getT } from '@ap/shared/src/locales';
import { IGetListResponse, IRole } from '@ap/shared/src/types';

const route = ROUTES.api.roles.substring(1);

@ApiTags(getT().roles)
@Controller(route)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: getT().entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalRoleDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<IRole> {
    const role = await this.roleService.create(createRoleDto);
    return plainToInstance(ExternalRoleDto, role);
  }

  @ApiOperation({ summary: getT().getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalRoleDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<IRole> {
    const role = await this.roleService.getOne(id);
    return plainToInstance(ExternalRoleDto, role);
  }

  @ApiOperation({ summary: getT().getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: RolesListDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() getRolesDto: GetRolesDto,
  ): Promise<IGetListResponse<IRole>> {
    const roles = await this.roleService.getList(getRolesDto);
    return plainToInstance(RolesListDto, roles);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<void> {
    await this.roleService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id/rights')
  async updateRights(
    @Param('id') id: string,
    @Body() rightsQueryItemsDta: RightsQueryItemsDto,
  ): Promise<void> {
    await this.roleService.updateRights(id, rightsQueryItemsDta.items);
  }

  @ApiOperation({ summary: getT().deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(
    @Body() queryItemsDto: QueryItemsDto<IRole['id']>,
  ): Promise<void> {
    await this.roleService.delete(queryItemsDto.items);
  }
}
