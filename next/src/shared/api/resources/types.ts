export interface IResource {
  id: number;
  name: string;
  path: string;
  description: string | null;
  enabled: boolean;
  default: boolean;
  RolesResources?: IRolesResources;
}

export type IResourceCreate = Pick<
  IResource,
  'name' | 'path' | 'description' | 'enabled'
>;

export interface IRolesResources {
  roleId: number;
  resourceId: number;
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
}
