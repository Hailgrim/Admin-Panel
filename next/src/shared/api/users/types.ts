import { IRole } from '../roles/types';

export interface IUser {
  id: string;
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
