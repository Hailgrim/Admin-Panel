export const PROJECT_TAG = process.env.PROJECT_TAG || 'AP'
export const HOST = process.env.NGINX_HOST || document.location.host

export const API_HOST = process.env.NEST_CORE_HOST && process.env.NEST_CORE_PORT
  ? `http://${process.env.NEST_CORE_HOST}:${process.env.NEST_CORE_PORT}`
  : `https://api.${document.location.host}`

/** Time in seconds */
export const ACCESS_TOKEN_LIFETIME
  = Number(process.env.ACCESS_TOKEN_LIFETIME) || 60 * 60
/** Time in seconds */
export const REFRESH_TOKEN_LIFETIME
  = Number(process.env.REFRESH_TOKEN_LIFETIME) || 60 * 60 * 24 * 7

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
}
