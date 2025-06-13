import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ResourceEntity } from './resource.entity';
import {
  TCreateResource,
  TGetResources,
  TUpdateResource,
  TGetListRequest,
  IGetListResponse,
} from '@ap/shared';
import { DatabaseService } from 'src/database/database.service';
import { TDatabaseGetList } from 'src/database/database.types';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourcesRepository: Repository<ResourceEntity>,
    private databaseService: DatabaseService,
  ) {}

  async create(fields: TCreateResource): Promise<ResourceEntity> {
    try {
      const resource = this.resourcesRepository.create(fields);
      return this.resourcesRepository.save(resource);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createManyDefault(
    fieldsArr: TCreateResource[],
  ): Promise<ResourceEntity[]> {
    try {
      const resources = fieldsArr.map((fields) =>
        this.resourcesRepository.create({ ...fields, default: true }),
      );
      return this.resourcesRepository.save(resources);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOne(id: string): Promise<ResourceEntity> {
    let resource: ResourceEntity | null;

    try {
      resource = await this.resourcesRepository.findOne({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!resource) {
      throw new NotFoundException();
    }

    return resource;
  }

  prepareGetListOptions(
    fields?: TGetListRequest<TGetResources>,
    isDefault?: boolean,
  ): TDatabaseGetList<ResourceEntity> {
    const options = this.databaseService.preparePaginationOptions<
      ResourceEntity,
      TGetResources
    >(fields);

    options.where = {};

    if (fields?.name !== undefined) {
      options.where.name = this.databaseService.iLike(`%${fields.name}%`);
    }

    if (fields?.path !== undefined) {
      options.where.path = this.databaseService.iLike(`%${fields.path}%`);
    }

    if (fields?.description !== undefined) {
      options.where.description = this.databaseService.iLike(
        `%${fields.description}%`,
      );
    }

    if (isDefault !== undefined) {
      options.where.default = isDefault;
    }

    return options;
  }

  async getList(
    fields?: TGetListRequest<TGetResources>,
    isDefault?: boolean,
  ): Promise<IGetListResponse<ResourceEntity>> {
    const options = this.prepareGetListOptions(fields, isDefault);

    try {
      if (fields?.reqCount) {
        const result = await this.resourcesRepository.findAndCount(options);
        return {
          rows: result[0],
          page: options.skip / options.take + 1,
          limit: options.take,
          count: result[1],
        };
      } else {
        return {
          rows: await this.resourcesRepository.find(options),
          page: options.skip / options.take + 1,
          limit: options.take,
        };
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, fields: TUpdateResource): Promise<void> {
    let result: UpdateResult;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestException();
    }

    try {
      result = await this.resourcesRepository.update(
        { id, default: false },
        fields,
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async delete(ids: string[]): Promise<void> {
    let result: DeleteResult;

    try {
      result = await this.resourcesRepository.delete({
        id: In(ids),
        default: false,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
