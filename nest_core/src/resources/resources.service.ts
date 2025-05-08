import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindOptions } from 'sequelize';

import { ResourceModel } from './resource.entity';
import { PUBLIC, RESOURCES_REPOSITORY } from 'libs/constants';
import {
  TCreateResource,
  TGetResources,
  TUpdateResource,
  TGetListRequest,
  IGetListResponse,
} from '@ap/shared';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ResourcesService {
  constructor(
    @Inject(RESOURCES_REPOSITORY)
    private resourcesRepository: typeof ResourceModel,
    private databaseService: DatabaseService,
  ) {}

  async create(fields: TCreateResource): Promise<ResourceModel> {
    try {
      return await this.resourcesRepository.create(fields);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createManyDefault(
    resources: TCreateResource[],
  ): Promise<ResourceModel[]> {
    try {
      return await this.resourcesRepository.bulkCreate(
        resources.map((resource) => ({ ...resource, default: true })),
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOnePublic(id: string): Promise<ResourceModel> {
    let resource: ResourceModel | null;

    try {
      resource = await this.resourcesRepository
        .scope(PUBLIC)
        .findOne({ where: { id } });
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
  ): FindOptions<ResourceModel> {
    const options: FindOptions<ResourceModel> =
      this.databaseService.preparePaginationOptions<
        ResourceModel,
        TGetResources
      >(fields);

    options.where = {};

    if (fields?.name !== undefined) {
      options.where.name = { [this.databaseService.iLike]: `%${fields.name}%` };
    }

    if (fields?.path !== undefined) {
      options.where.path = { [this.databaseService.iLike]: `%${fields.path}%` };
    }

    if (fields?.description !== undefined) {
      options.where.description = {
        [this.databaseService.iLike]: `%${fields.description}%`,
      };
    }

    if (isDefault !== undefined) {
      options.where.default = isDefault;
    }

    return options;
  }

  async getListPublic(
    fields?: TGetListRequest<TGetResources>,
    isDefault?: boolean,
  ): Promise<IGetListResponse<ResourceModel>> {
    const options = this.prepareGetListOptions(fields, isDefault);

    try {
      if (fields?.reqCount) {
        return await this.resourcesRepository
          .scope(PUBLIC)
          .findAndCountAll(options);
      } else {
        return {
          rows: await this.resourcesRepository.scope(PUBLIC).findAll(options),
        };
      }
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateFields(id: string, fields: TUpdateResource): Promise<boolean> {
    let affectedCount = 0;

    try {
      [affectedCount] = await this.resourcesRepository.update(fields, {
        where: { id, default: false },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (affectedCount === 0) {
      throw new NotFoundException();
    }

    return true;
  }

  async delete(ids: string[]): Promise<boolean> {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.resourcesRepository.destroy({
        where: { id: ids, default: false },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    if (destroyedCount === 0) {
      throw new NotFoundException();
    }

    return true;
  }
}
