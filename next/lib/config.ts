export const PROJECT_TAG = process.env.PROJECT_TAG || 'AP';
export const HOST = process.env.NGINX_HOST || document.location.host.split('.').splice(-2).join('.');

export const API_HOST = process.env.NEST_CORE_HOST && process.env.NEST_CORE_PORT
  ? `http://${process.env.NEST_CORE_HOST}:${process.env.NEST_CORE_PORT}`
  : `https://api.${HOST}`;

/** Time in seconds */
export const ACCESS_TOKEN_LIFETIME =
  Number(process.env.ACCESS_TOKEN_LIFETIME) || 60 * 60;
/** Time in seconds */
export const REFRESH_TOKEN_LIFETIME =
  Number(process.env.REFRESH_TOKEN_LIFETIME) || 60 * 60 * 24 * 7;
