/** Name validation regex */
export const NAME_REGEX = /^[\w ]{1,100}$/;
/** Email validation regex */
export const EMAIL_REGEX = /^[\w.]+@\w+\.+\w{2,4}$/;
/** Password validation regex */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{10,100}$/;

/** Supported application routes */
export const ROUTES = {
  ui: {
    signIn: '/authorization',
    signUp: '/registration',
    forget: '/forgot-password',
    home: '/',
    profile: '/profile',
    users: '/users',
    newUser: '/users/new',
    user: (id: string | number) => `/users/${id}`,
    roles: '/roles',
    newRole: '/roles/new',
    role: (id: string | number) => `/roles/${id}`,
    resources: '/resources',
    newResource: '/resources/new',
    resource: (id: string | number) => `/resources/${id}`,
  },
  api: {
    sighUp: 'auth/sign-up',
    signIn: '/auth/sign-in',
    verify: '/auth/verify-user',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refresh: '/auth/refresh',
    signOut: '/auth/log-out',
    profile: '/profile',
    updatePassword: '/profile/update-password',
    changeEmail: '/profile/change-email',
    sessions: '/profile/sessions',
    users: '/users',
    user: (id: string | number) => `/users/${id}`,
    userRoles: (id: string | number) => `/users/${id}/roles`,
    roles: '/roles',
    role: (id: string | number) => `/roles/${id}`,
    roleResources: (id: string | number) => `/roles/${id}/resources`,
    resources: '/resources',
    resource: (id: string | number) => `/resources/${id}`,
  },
};
