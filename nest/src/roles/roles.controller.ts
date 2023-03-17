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
import lang from 'libs/lang';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Rights } from 'libs/constants';
import { IFindAndCount, IRole } from 'libs/types';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetRolesDto } from './dto/get-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesResourcesDto } from 'src/database/dto/roles-resources.dto';

const route = 'roles';

@ApiTags(String(lang.get('en')?.roles))
@Controller(route)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: lang.get('en')?.entityCreation })
  @ApiResponse({ status: 201, type: IRole })
  @Roles({ path: route, action: Rights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<IRole> {
    res.status(HttpStatus.CREATED);
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: lang.get('en')?.getEntities })
  @ApiResponse({ status: 200, type: [IRole] })
  @Roles({ path: route, action: Rights.Listing })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async findAll(
    @Query() getRolesDto: GetRolesDto,
  ): Promise<IRole[] | IFindAndCount<IRole>> {
    if (getRolesDto.count) {
      return this.roleService.findAndCountAllPublic(getRolesDto);
    } else {
      return this.roleService.findAllPublic(getRolesDto);
    }
  }

  @ApiOperation({ summary: lang.get('en')?.getEntity })
  @ApiResponse({ status: 200, type: IRole })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IRole> {
    return this.roleService.findOnePublic(Number(id));
  }

  @ApiOperation({ summary: lang.get('en')?.updateEntity })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<boolean> {
    const result = await this.roleService.updateFields(
      Number(id),
      updateRoleDto,
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
  @Patch('/:id/resources')
  async updateResources(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('id') id: string,
    @Body() rolesResourcesDtoArr: RolesResourcesDto[],
  ): Promise<boolean> {
    const result = await this.roleService.updateResources(
      Number(id),
      rolesResourcesDtoArr,
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
    return this.roleService.delete(Number(id));
  }
}
