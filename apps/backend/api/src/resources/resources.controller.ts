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

import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { ERights } from 'libs/constants';
import { Roles } from 'src/roles/roles.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetResourcesDto } from './dto/get-resources.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { QueryItemsDto } from 'src/database/dto/query-items.dto';
import { IResource, IGetListResponse, ROUTES, getT } from '@ap/shared';
import { ExternalResourceDto } from './dto/external-resource.dto';
import { ResourcesListDto } from './dto/resources-list.dto';

const route = ROUTES.api.resources.substring(1);

@ApiTags(getT().resources)
@Controller(route)
export class ResourcesController {
  constructor(private resourceService: ResourcesService) {}

  @ApiOperation({ summary: getT().entityCreation })
  @ApiResponse({ status: HttpStatus.CREATED, type: ExternalResourceDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles({ path: route, action: ERights.Creating })
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<IResource> {
    const resource = await this.resourceService.create(createResourceDto);
    return plainToInstance(ExternalResourceDto, resource);
  }

  @ApiOperation({ summary: getT().getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: ExternalResourceDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<IResource> {
    const resource = await this.resourceService.getOne(id);
    return plainToInstance(ExternalResourceDto, resource);
  }

  @ApiOperation({ summary: getT().getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: ResourcesListDto })
  @HttpCode(HttpStatus.OK)
  @Roles({ path: route, action: ERights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getList(
    @Query() getResourcesDto: GetResourcesDto,
  ): Promise<IGetListResponse<IResource>> {
    const resources = await this.resourceService.getList(getResourcesDto);
    return plainToInstance(ResourcesListDto, resources);
  }

  @ApiOperation({ summary: getT().updateEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Updating })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<void> {
    await this.resourceService.update(id, updateResourceDto);
  }

  @ApiOperation({ summary: getT().deleteEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ path: route, action: ERights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  async delete(
    @Body() queryItemsDto: QueryItemsDto<IResource['id']>,
  ): Promise<void> {
    await this.resourceService.delete(queryItemsDto.items);
  }
}
