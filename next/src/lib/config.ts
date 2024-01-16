export const HOST = process.env.NGINX_HOST;
export const API_HOST = process.env.PORT
  ? `http://${process.env.NEST_CORE_HOST}:${process.env.NEST_CORE_PORT}`
  : `https://api.${HOST}`;

/** Time in seconds */
export const ACCESS_TOKEN_LIFETIME = Number(process.env.ACCESS_TOKEN_LIFETIME);
/** Time in seconds */
export const REFRESH_TOKEN_LIFETIME = Number(process.env.REFRESH_TOKEN_LIFETIME);
