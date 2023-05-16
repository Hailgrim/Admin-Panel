import { DEV } from './constants';

export const MODE = process.env.NODE_ENV || DEV;
export const PROJECT_TAG = process.env.PROJECT_TAG || 'adminpanel';

export const HOST = process.env.NEST_CORE_PORT ? '0.0.0.0' : 'localhost';
export const PORT = Number(process.env.NEST_CORE_PORT || 3000);

export const RMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
export const RMQ_PORT = Number(process.env.RABBITMQ_PORT) || 5672;
export const RMQ_USER = process.env.RABBITMQ_DEFAULT_USER || 'user';
export const RMQ_PASSWORD = process.env.RABBITMQ_DEFAULT_PASS || 'password';

export const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
export const DB_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const DB_USER = process.env.POSTGRES_USER || 'user';
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';
export const DB_NAME = process.env.POSTGRES_DB || 'main';

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_DB = Number(process.env.REDIS_USERNAME) || 0;
export const REDIS_USERNAME = process.env.REDIS_USERNAME || 'user';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'password';

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
