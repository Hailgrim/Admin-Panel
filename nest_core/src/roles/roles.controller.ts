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
import { Rights } from 'libs/constants';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetRolesDto } from './dto/get-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesResourcesDto } from 'src/database/dto/roles-resources.dto';
import d from 'locales/dictionary';
import { IRole } from './roles.types';
import { IFindAndCount } from 'src/database/database.types';

const route = 'roles';

@ApiTags(d['en'].roles)
@Controller(route)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: d['en'].entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: IRole })
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

  @ApiOperation({ summary: d['en'].getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: [IRole] })
  @Roles({ path: route, action: Rights.Reading })
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

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: IRole })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IRole> {
    return this.roleService.findOnePublic(Number(id));
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
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

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
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

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(@Body() id: number | number[]): Promise<boolean> {
    return this.roleService.delete(id);
  }
}
