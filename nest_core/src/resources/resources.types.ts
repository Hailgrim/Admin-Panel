import { IRolesResources } from 'src/database/database.types';
import { IRole } from 'src/roles/roles.types';

export abstract class IResource {
  id: string;
  name: string;
  path: string;
  description?: string | null;
  enabled: boolean;
  default: boolean;
  roles?: IRole[];
  RolesResources?: IRolesResources;
}

export type CreateResourceFields = Pick<
  IResource,
  'name' | 'path' | 'description' | 'enabled'
> &
  Partial<Pick<IResource, 'default'>>;

export type GetResourcesFields = Partial<
  Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>
>;

export type UpdateResourceFields = Partial<
  Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>
>;
