/** Name validation regex */
export const NAME_REGEX = /^([A-Za-z0-9\s]){1,100}$/
/** Email validation regex */
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
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
    user: '/users/#ID#',
    roles: '/roles',
    newRole: '/roles/new',
    role: '/roles/#ID#',
    resources: '/resources',
    newResource: '/resources/new',
    resource: '/resources/#ID#',
    files: '/files',
    newFile: '/files/new',
  },
  /** API routes */
  api: {
    auth: {
      sighUp: 'auth/sign-up',
      signIn: '/auth/sign-in',
      verify: '/auth/verify-user',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      refresh: '/auth/refresh',
      getProfile: '/auth/profile',
      updateProfile: '/auth/profile',
      signOut: '/auth/log-out',
    },
  },
}
