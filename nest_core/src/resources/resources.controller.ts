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
  create(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<IResource> {
    res.status(HttpStatus.CREATED);
    return this.resourceService.create(createResourceDto);
  }

  @ApiOperation({ summary: d['en'].getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalResourceDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<IResource> {
    return this.resourceService.getOnePublic(id);
  }

  @ApiOperation({ summary: d['en'].getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: ResourcesListDto })
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  getList(
    @Query() getResourcesDto: GetResourcesDto,
  ): Promise<IGetListResponse<IResource>> {
    return this.resourceService.getListPublic(getResourcesDto);
  }

  @ApiOperation({ summary: d['en'].updateEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<boolean> {
    return this.resourceService.updateFields(id, updateResourceDto);
  }

  @ApiOperation({ summary: d['en'].deleteEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  delete(
    @Body() QueryItemsDto: QueryItemsDto<IResource['id']>,
  ): Promise<boolean> {
    return this.resourceService.delete(QueryItemsDto.items);
  }
}
