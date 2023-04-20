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
import lang from 'libs/lang';
import { RolesGuard } from 'src/roles/roles.guard';
import { Rights } from 'libs/constants';
import { Roles } from 'src/roles/roles.decorator';
import { IFindAndCount, IResource } from 'libs/types';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetResourcesDto } from './dto/get-resources.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

const route = 'resources';

@ApiTags(String(lang.get('en')?.resources))
@Controller(route)
export class ResourcesController {
  constructor(private resourceService: ResourcesService) {}

  @ApiOperation({ summary: lang.get('en')?.entityCreation })
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

  @ApiOperation({ summary: lang.get('en')?.getEntities })
  @ApiResponse({ status: HttpStatus.OK, type: [IResource] })
  @Roles({ path: route, action: Rights.Listing })
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

  @ApiOperation({ summary: lang.get('en')?.getEntity })
  @ApiResponse({ status: HttpStatus.OK, type: IResource })
  @Roles({ path: route, action: Rights.Reading })
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IResource> {
    return this.resourceService.findOnePublic(Number(id));
  }

  @ApiOperation({ summary: lang.get('en')?.updateEntity })
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
      Number(id),
      updateResourceDto,
    );
    if (!result) {
      res.status(HttpStatus.NO_CONTENT);
    }
    return result;
  }

  @ApiOperation({ summary: lang.get('en')?.deleteEntity })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Roles({ path: route, action: Rights.Deleting })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.resourceService.delete(Number(id));
  }
}
