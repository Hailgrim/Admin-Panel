import { DEV } from './constants';

export const MODE = process.env.NODE_ENV || DEV;
export const PROJECT_TAG = process.env.PROJECT_TAG || 'adminpanel';

export const HOST = process.env.NEST_CORE_PORT ? '0.0.0.0' : 'localhost';
export const PORT = Number(process.env.NEST_CORE_PORT || 3000);

export const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
export const DB_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const DB_USER = process.env.POSTGRES_USER || 'root';
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD || '';
export const DB_NAME = process.env.POSTGRES_DB || 'main';

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_DB = Number(process.env.REDIS_USERNAME) || 0;
export const REDIS_USERNAME = process.env.REDIS_USERNAME || '';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

export const MAIL_TEST = MODE == DEV;
export const MAIL_HOST = process.env.NEST_CORE_MAIL_HOST || 'localhost';
export const MAIL_PORT = Number(process.env.NEST_CORE_MAIL_PORT) || 587;
export const MAIL_USER = process.env.NEST_CORE_MAIL_USER || 'root';
export const MAIL_PASSWORD = process.env.NEST_CORE_MAIL_PASSWORD || '';
export const MAIL_FROM =
  process.env.NEST_CORE_MAIL_FROM || '"No Reply" <no-reply@localhost>';

/** Time in seconds */
export const ACCESS_TOKEN_LIFETIME =
  Number(process.env.ACCESS_TOKEN_LIFETIME) || 60 * 60;
export const ACCESS_TOKEN_SECRET_KEY =
  process.env.NEST_CORE_ACCESS_TOKEN_SECRET_KEY || 'accessTokenSecretKey';

/** Time in seconds */
export const REFRESH_TOKEN_LIFETIME =
  Number(process.env.REFRESH_TOKEN_LIFETIME) || 60 * 60 * 24 * 7;
export const REFRESH_TOKEN_SECRET_KEY =
  process.env.NEST_CORE_REFRESH_TOKEN_SECRET_KEY || 'refreshTokenSecretKey';
