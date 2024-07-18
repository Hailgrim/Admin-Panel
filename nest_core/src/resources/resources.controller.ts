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

import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Rights } from 'libs/constants';
import { Roles } from 'src/roles/roles.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetResourcesDto } from './dto/get-resources.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import d from 'locales/dictionary';
import { IResource } from './resources.types';
import { IFindAndCount } from 'src/database/database.types';

const route = 'resources';

@ApiTags(d['en'].resources)
@Controller(route)
export class ResourcesController {
  constructor(private resourceService: ResourcesService) {}

  @ApiOperation({ summary: d['en'].entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: IResource })
  @Roles({ path: route, action: Rights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<IResource> {
    res.status(HttpStatus.CREATED);
    return this.resourceService.create(createResourceDto);
  }

  @ApiOperation({ summary: d['en'].getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: [IResource] })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async findAll(
    @Query() getResourcesDto: GetResourcesDto,
  ): Promise<IResource[] | IFindAndCount<IResource>> {
    if (getResourcesDto.count) {
      return this.resourceService.findAndCountAllPublic(getResourcesDto);
    } else {
      return this.resourceService.findAllPublic(getResourcesDto);
    }
  }

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: IResource })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IResource> {
    return this.resourceService.findOnePublic(id);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<boolean> {
    const result = await this.resourceService.updateFields(
      id,
      updateResourceDto,
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
  async delete(@Body() id: string | string[]): Promise<boolean> {
    return this.resourceService.delete(id);
  }
}
