import { ROLES_RESOURCES_REPOSITORY } from 'libs/constants';
import { RolesResources } from './roles-resources.entity';

export const rolesResourcesProviders = [
  {
    provide: ROLES_RESOURCES_REPOSITORY,
    useValue: RolesResources,
  },
];
