export interface IFindAndCount<T> {
  rows: T[];
  count: number;
}

export abstract class IRolesResources {
  roleId: string;
  resourceId: string;
  creating: boolean;
  reading: boolean;
  updating: boolean;
  deleting: boolean;
}

export abstract class IUsersRoles {
  userId: string;
  roleId: string;
}
