import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';

import {
  PUBLIC,
  ROLES_REPOSITORY,
  ROLES_RESOURCES_REPOSITORY,
  WITH_RESOURCES,
} from 'libs/constants';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { GetRolesDto } from './dto/get-roles.dto';
import { preparePaginationOptions } from 'libs/functions';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IFindAndCount } from 'libs/types';
import { RolesResources } from 'src/database/roles-resources.entity';
import { RolesResourcesDto } from 'src/database/dto/roles-resources.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLES_REPOSITORY)
    private rolesRepository: typeof Role,
    @Inject(ROLES_RESOURCES_REPOSITORY)
    private rolesResourcesRepository: typeof RolesResources,
  ) {}

  private prepareSearchOptions(getRolesDto?: GetRolesDto): FindOptions<Role> {
    const options: FindOptions<Role> = {
      ...preparePaginationOptions(getRolesDto),
    };
    if (getRolesDto?.name !== undefined) {
      options.where = { ...options.where, name: getRolesDto.name };
    }
    if (getRolesDto?.description !== undefined) {
      options.where = {
        ...options.where,
        description: getRolesDto.description,
      };
    }
    return options;
  }

  private prepareGetOptions(getRolesDto?: GetRolesDto): FindOptions<Role> {
    return {
      ...this.prepareSearchOptions(getRolesDto),
      ...preparePaginationOptions(getRolesDto),
    };
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return await this.rolesRepository.create({
        ...createRoleDto,
        default: false,
        admin: false,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOrCreateDefault(
    name: string,
    description?: string,
    isAdmin?: boolean,
  ): Promise<Role> {
    let role: Role;

    try {
      [role] = await this.rolesRepository.findOrCreate({
        where: { name, default: true, admin: Boolean(isAdmin) },
        defaults: { name, description, default: true, admin: Boolean(isAdmin) },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return role;
  }

  async findOnePublic(id: number): Promise<Role> {
    let role: Role | null;

    try {
      role = await this.rolesRepository
        .scope([PUBLIC, WITH_RESOURCES])
        .findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async findAllPublic(
    getRolesDto?: GetRolesDto,
    isAdmin?: boolean,
  ): Promise<Role[]> {
    const options = this.prepareGetOptions(getRolesDto);
    if (isAdmin) {
      options.where = { ...options.where, admin: true };
    }
    try {
      return this.rolesRepository.scope(PUBLIC).findAll(options);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAndCountAllPublic(
    getRolesDto?: GetRolesDto,
  ): Promise<IFindAndCount<Role>> {
    const options = this.prepareGetOptions(getRolesDto);
    try {
      return this.rolesRepository.scope(PUBLIC).findAndCountAll(options);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateFields(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<boolean> {
    let affectedCount = 0;

    try {
      [affectedCount] = await this.rolesRepository.update(updateRoleDto, {
        where: { id, default: { [Op.ne]: true } },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (affectedCount == 0) {
      const role = await this.rolesRepository.findOne({ where: { id } });
      if (!role) {
        throw new NotFoundException();
      } else {
        return false;
      }
    }

    return true;
  }

  async updateResources(
    id: number,
    rolesResourcesDtoArr: RolesResourcesDto[],
  ): Promise<boolean> {
    let role: Role | null;

    try {
      role = await this.rolesRepository
        .scope(WITH_RESOURCES)
        .findOne({ where: { id, admin: { [Op.ne]: true } } });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!role) {
      throw new NotFoundException();
    }

    const deleteAllows: number[] = [];
    role.resources?.forEach((resource) => {
      if (!rolesResourcesDtoArr.some((value) => value.roleId == resource.id)) {
        deleteAllows.push(resource.id);
      }
    });

    if (deleteAllows.length > 0) {
      try {
        await this.rolesResourcesRepository.destroy({
          where: { roleId: id, resourceId: deleteAllows },
        });
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    try {
      await Promise.all(
        rolesResourcesDtoArr.map(async (roleResource) => {
          const [, created] = await this.rolesResourcesRepository.findOrCreate({
            where: {
              roleId: roleResource.roleId,
              resourceId: roleResource.resourceId,
            },
            defaults: roleResource,
          });
          if (!created) {
            await this.rolesResourcesRepository.update(roleResource, {
              where: {
                roleId: roleResource.roleId,
                resourceId: roleResource.resourceId,
              },
            });
          }
        }),
      );
    } catch (error) {}

    return true;
  }

  async delete(id: number | number[]) {
    let destroyedCount = 0;

    try {
      destroyedCount = await this.rolesRepository.destroy({
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
