import { DEV } from '@ap/shared';

export const MODE = process.env.NODE_ENV || DEV;

export const HOST = process.env.NEST_CORE_HOST || '0.0.0.0';
export const PORT = Number(process.env.NEST_CORE_PORT || 3000);

export const NGINX_HOST = process.env.NGINX_HOST || 'localhost';

export const RMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
export const RMQ_PORT = Number(process.env.RABBITMQ_PORT) || 5672;
export const RMQ_USER = process.env.RABBITMQ_DEFAULT_USER || 'user';
export const RMQ_PASSWORD = process.env.RABBITMQ_DEFAULT_PASS || 'password';
export const RMQ_MAIL_QUEUE = process.env.RABBITMQ_MAIL_QUEUE || 'mailQueue';

export const MAIL_REGISTRATION =
  process.env.MAIL_REGISTRATION || 'registration';
export const MAIL_FORGOT_PASSWORD =
  process.env.MAIL_FORGOT_PASSWORD || 'forgotPassword';
export const MAIL_CHANGE_EMAIL = process.env.MAIL_CHANGE_EMAIL || 'changeEmail';

export const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
export const DB_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const DB_USER = process.env.POSTGRES_USER || 'user';
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';
export const DB_NAME = process.env.POSTGRES_DB || 'main';

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_USER = process.env.REDIS_USER || 'user';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'password';
export const REDIS_DB = Number(process.env.REDIS_DB) || 0;

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
