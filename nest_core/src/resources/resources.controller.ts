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

import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { ERights } from 'libs/constants';
import { Roles } from 'src/roles/roles.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetResourcesDto } from './dto/get-resources.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { IResource, IGetListResponse, d, ROUTES } from '@ap/shared';
import { ExternalResourceDto } from './dto/external-resource.dto';
import { ResourcesListDto } from './dto/resources-list.dto';

const route = ROUTES.api.resources.substring(1);

@ApiTags(d['en'].resources)
@Controller(route)
export class ResourcesController {
  constructor(private resourceService: ResourcesService) {}

  @ApiOperation({ summary: d['en'].entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalResourceDto })
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(
    @Body() createResourceDto: CreateResourceDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IResource> {
    res.status(HttpStatus.CREATED);
    const resource = await this.resourceService.create(createResourceDto);
    return plainToInstance(ExternalResourceDto, resource);
  }

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalResourceDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async getOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IResource> {
    res.status(HttpStatus.OK);
    const resource = await this.resourceService.getOne(id);
    return plainToInstance(ExternalResourceDto, resource);
  }

  @ApiOperation({ summary: d['en'].getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: ResourcesListDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() getResourcesDto: GetResourcesDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<IGetListResponse<IResource>> {
    res.status(HttpStatus.OK);
    const resources = await this.resourceService.getList(getResourcesDto);
    return plainToInstance(ResourcesListDto, resources);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.resourceService.update(id, updateResourceDto);
  }

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(
    @Body() QueryItemsDto: QueryItemsDto<IResource['id']>,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    res.status(HttpStatus.NO_CONTENT);
    await this.resourceService.delete(QueryItemsDto.items);
  }
}
