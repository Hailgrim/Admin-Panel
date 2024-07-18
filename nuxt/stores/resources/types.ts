export interface IResource {
  id: string;
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
  roleId: string;
  resourceId: string;
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
}
