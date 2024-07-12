import { IRole } from '../roles/types';

export interface IUser {
  id: number;
  email: string;
  name: string;
  enabled: boolean;
  verified: boolean;
  roles?: IRole[];
  createdAt?: string;
}

export type IUserCreate = Pick<IUser, 'name' | 'email' | 'enabled'> & {
  password: string;
};

export interface IUserAndRoles {
  user: IUser;
  roles?: IRole[] | null;
}
