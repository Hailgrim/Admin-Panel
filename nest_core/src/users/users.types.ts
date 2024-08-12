import { IRole } from 'src/roles/roles.types';

export abstract class IUser {
  id: string;
  email?: string | null;
  password?: string | null;
  name: string;
  enabled: boolean;
  verified: boolean;
  verificationCode?: string | null;
  resetPasswordCode?: string | null;
  changeEmailCode?: string | null;
  temporaryEmail?: string | null;
  roles?: IRole[];
}

export type CreateUserFields = Required<
  Pick<IUser, 'email' | 'password' | 'name' | 'enabled'>
>;

export type GetUsersFields = Partial<
  Omit<
    IUser,
    | 'password'
    | 'verificationCode'
    | 'resetPasswordCode'
    | 'changeEmailCode'
    | 'temporaryEmail'
  >
>;

export type UpdateUserFields = Partial<Omit<IUser, 'id' | 'roles'>>;
