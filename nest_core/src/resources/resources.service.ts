import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';

import { CreateResourceDto } from './dto/create-resource.dto';
import { Resource } from './resource.entity';
import { PUBLIC, RESOURCES_REPOSITORY } from 'libs/constants';
import { GetResourcesDto } from './dto/get-resources.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { IFindAndCount } from 'src/database/database.types';
import { preparePaginationOptions } from 'src/database/database.utils';

@Injectable()
export class ResourcesService {
  constructor(
    @Inject(RESOURCES_REPOSITORY)
    private resourcesRepository: typeof Resource,
  ) {}

  private prepareSearchOptions(
    getResourcesDto?: GetResourcesDto,
  ): FindOptions<Resource> {
    const options: FindOptions<Resource> = {
      ...preparePaginationOptions(getResourcesDto),
    };
    if (getResourcesDto?.name !== undefined) {
      options.where = { ...options.where, name: getResourcesDto.name };
    }
    if (getResourcesDto?.path !== undefined) {
      options.where = { ...options.where, path: getResourcesDto.path };
    }
    if (getResourcesDto?.description !== undefined) {
      options.where = {
        ...options.where,
        description: getResourcesDto.description,
      };
    }
    return options;
  }

  private prepareGetOptions(
    getResourcesDto?: GetResourcesDto,
  ): FindOptions<Resource> {
    return {
      ...this.prepareSearchOptions(getResourcesDto),
      ...preparePaginationOptions(getResourcesDto),
    };
  }

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    try {
      return this.resourcesRepository.create({
        ...createResourceDto,
        default: false,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createMany(
    createResourceDtos: CreateResourceDto[],
  ): Promise<Resource[]> {
    try {
      return this.resourcesRepository.bulkCreate(
        createResourceDtos.map((dto) => ({ ...dto, default: true })),
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOnePublic(id: number): Promise<Resource> {
    let resource: Resource | null;

    try {
      resource = await this.resourcesRepository
        .scope(PUBLIC)
        .findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!resource) {
      throw new NotFoundException();
    }

    return resource;
  }

  async findAllPublic(
    getResourcesDto?: GetResourcesDto,
    isDefault?: boolean,
  ): Promise<Resource[]> {
    const options = this.prepareGetOptions(getResourcesDto);
    if (isDefault) {
      options.where = { ...options.where, default: true };
    }
    try {
      return this.resourcesRepository.scope(PUBLIC).findAll(options);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAndCountAllPublic(
    getResourcesDto?: GetResourcesDto,
  ): Promise<IFindAndCount<Resource>> {
    const options = this.prepareGetOptions(getResourcesDto);
    try {
      return this.resourcesRepository.scope(PUBLIC).findAndCountAll(options);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateFields(
    id: number,
    udateResourceDto: UpdateResourceDto,
  ): Promise<boolean> {
    let affectedCount = 0;

    try {
      [affectedCount] = await this.resourcesRepository.update(
        udateResourceDto,
        {
          where: { id, default: { [Op.ne]: true } },
        },
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (affectedCount == 0) {
      const resource = await this.resourcesRepository.findOne({
        where: { id },
      });
      if (!resource) {
        throw new NotFoundException();
      } else {
        return false;
      }
    }

    return true;
  }

  async delete(id: number | number[]) {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.resourcesRepository.destroy({
        where: { id, default: { [Op.ne]: true } },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (destroyedCount == 0) {
      throw new NotFoundException();
    }

    return true;
  }
}
