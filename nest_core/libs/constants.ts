/** Name validation regex */
export const NAME_REGEX = /^[\w ]{1,100}$/;
/** Email validation regex */
export const EMAIL_REGEX = /^[\w.]+@\w+\.+\w{2,4}$/;
/** Password validation regex */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{10,100}$/;
export const DEV = 'development';
export const SEQUELIZE = 'SEQUELIZE';
export const USERS_REPOSITORY = 'USERS_REPOSITORY';
export const SESSION_REPOSITORY = 'SESSION_REPOSITORY';
export const ROLES_REPOSITORY = 'ROLES_REPOSITORY';
export const ROLES_KEY = 'ROLES';
export const RESOURCES_REPOSITORY = 'RESOURCES_REPOSITORY';
export const ROLES_RESOURCES_REPOSITORY = 'ROLES_RESOURCES_REPOSITORY';
export const PUBLIC = 'public';
export const WITH_ROLES = 'withRoles';
export const WITH_RESOURCES = 'withResources';
export const MAIL_SERVER = 'MAIL_SERVER';
export const REDIS = 'REDIS';

export enum ERights {
  Creating = 'creating',
  Reading = 'reading',
  Updating = 'updating',
  Deleting = 'deleting',
}
