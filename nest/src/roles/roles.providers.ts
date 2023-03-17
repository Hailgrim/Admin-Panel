import { ROLES_REPOSITORY } from 'libs/constants';
import { Role } from './role.entity';

export const rolesProviders = [
  {
    provide: ROLES_REPOSITORY,
    useValue: Role,
  },
];
