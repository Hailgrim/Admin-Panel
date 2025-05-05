import { IRole } from './role';

export abstract class IUser {
  id: string;
  email?: string | null;
  password?: string | null;
  name: string;
  googleId?: string | null;
  enabled: boolean;
  verified: boolean;
  verificationCode?: string | null;
  resetPasswordCode?: string | null;
  changeEmailCode?: string | null;
  temporaryEmail?: string | null;
  roles?: IRole[];
}

export type TCreateUser = Required<
  Pick<IUser, 'email' | 'password' | 'name' | 'enabled'>
>;

export type TCreateGoogleUser = Pick<
  IUser,
  'googleId' | 'name' | 'verified' | 'enabled'
>;

export type TGetUsers = Partial<
  Omit<
    IUser,
    | 'password'
    | 'verificationCode'
    | 'resetPasswordCode'
    | 'changeEmailCode'
    | 'temporaryEmail'
  >
>;

export type TUpdateUser = Partial<Omit<IUser, 'id' | 'roles'>>;
