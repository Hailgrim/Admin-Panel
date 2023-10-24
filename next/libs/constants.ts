export const SIDE_MENU_WIDTH = '64px';
export const SIDE_MENU_WIDTH_OPENED = '256px';

/** Name validation regex */
export const NAME_REGEX = /^([A-Za-z0-9\s]){1,100}$/;
/** Email validation regex */
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
/** Password validation regex */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{10,100}$/

export enum Rights {
  Creating = 'creating',
  Listing = 'listing',
  Reading = 'reading',
  Updating = 'updating',
  Deleting = 'deleting',
}

/** Supported application routes */
export const ROUTES = {
  /** Authorization routes */
  auth: {
    signIn: '/authorization',
    signUp: '/registration',
    forget: '/forgot-password',
  },
  /** Panel routes */
  panel: {
    home: '/',
    profile: '/profile',
    users: '/users',
    newUser: '/users/new',
    user: '/users/[id]',
    getUserRoute: (id: number | string) => `/users/${id}`,
    roles: '/roles',
    newRole: '/roles/new',
    role: '/roles/[id]',
    getRoleRoute: (id: number | string) => `/roles/${id}`,
    resources: '/resources',
    newResource: '/resources/new',
    resource: '/resources/[id]',
    getResourceRoute: (id: number | string) => `/resources/${id}`,
    files: '/files',
    newFile: '/files/new',
  },
};
