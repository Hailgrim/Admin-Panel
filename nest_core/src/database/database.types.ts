export interface IFindAndCount<T> {
  rows: T[];
  count: number;
}

export abstract class IRolesResources {
  roleId: number;
  resourceId: number;
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
}

export abstract class IUsersRoles {
  userId: string;
  roleId: number;
}
