import { SetMetadata } from '@nestjs/common';

import { ROLES_KEY } from 'libs/constants';
import { IRoleConditions } from './roles.types';

export const Roles = (conditions: IRoleConditions) =>
  SetMetadata(ROLES_KEY, conditions);
