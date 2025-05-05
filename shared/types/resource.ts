import { IRights } from './database';
import { IRole } from './role';

export abstract class IResource {
  id: string;
  name: string;
  path: string;
  description?: string | null;
  enabled: boolean;
  default: boolean;
  roles?: IRole[];
  RightsModel?: IRights;
}

export type TCreateResource = Pick<
  IResource,
  'name' | 'path' | 'description' | 'enabled'
> &
  Partial<Pick<IResource, 'default'>>;

export type TGetResources = Partial<
  Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>
>;

export type TUpdateResource = Partial<
  Pick<IResource, 'name' | 'path' | 'description' | 'enabled'>
>;
