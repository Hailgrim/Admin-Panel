import { IRole } from 'src/roles/roles.types';

export abstract class IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  enabled: boolean;
  verified: boolean;
  verificationCode?: string | null;
  resetPasswordCode?: string | null;
  roles?: IRole[];
}

export type CreateUserFields = Pick<
  IUser,
  'email' | 'password' | 'name' | 'enabled'
>;

export type GetUsersFields = Partial<
  Omit<IUser, 'password' | 'verificationCode' | 'resetPasswordCode'>
>;

export type UpdateUserFields = Partial<Omit<IUser, 'roles' | 'id'>>;
